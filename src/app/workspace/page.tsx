"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Database, Play, RotateCcw, Download, Table2, Lightbulb,
  ChevronRight, ChevronDown, BrainCircuit, Loader2, X, Eye,
  Wand2, Copy, Check, BookOpen, Shield, Search, SlidersHorizontal,
  CheckCircle2, Circle,
} from 'lucide-react';
import { useQuestions } from '../../hooks/useQuestions';
import { useSchema } from '../../hooks/useSchema';
import type { Question, Difficulty } from '../../types/question';
import { format as formatSql } from 'sql-formatter';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

// ─── Difficulty colours ───────────────────────────────────────────────────────
const DIFF_PILL: Record<Difficulty, string> = {
  easy:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100   text-amber-700   border-amber-200',
  hard:   'bg-rose-100    text-rose-700    border-rose-200',
};

// ─── Simple inline markdown renderer (bold + code only) ──────────────────────
function renderPrompt(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`'))
      return <code key={i} className="bg-slate-100 text-indigo-700 px-1 rounded text-sm font-mono">{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    return p;
  });
}

// ─── DB display names ─────────────────────────────────────────────────────────
const DB_LABELS: Record<string, string> = {
  retail: 'Retail',
  hr: 'HR',
  flights: 'Flights',
  analytics: 'Analytics',
  finance: 'Finance',
};

export default function Workspace() {
  // ── Question browser state ────────────────────────────────────────────────
  const { questions, databases, topics, loading: qLoading, error: qError } = useQuestions();
  const [filterDb, setFilterDb] = useState<string>('all');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'all'>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [search, setSearch] = useState('');

  // ── Active question ───────────────────────────────────────────────────────
  const [currentQ, setCurrentQ] = useState<Question | null>(null);

  // ── Schema explorer ───────────────────────────────────────────────────────
  const [leftTab, setLeftTab] = useState<'questions' | 'schema'>('questions');
  // Use the header DB filter when set, otherwise fall back to current question's DB
  const activeSchemaDb = filterDb !== 'all' ? filterDb : (currentQ?.db ?? '');
  const { tables, loading: schemaLoading } = useSchema(activeSchemaDb);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  // ── Editor ────────────────────────────────────────────────────────────────
  const editorRef = useRef<any>(null);
  const sqlTextRef = useRef('');
  const [sqlText, setSqlText] = useState('');
  // Keeps schema accessible inside the Monaco completion provider closure
  const schemaRef = useRef<typeof tables>(tables);
  const completionDisposableRef = useRef<any>(null);
  useEffect(() => { schemaRef.current = tables; }, [tables]);

  // ── Execution state ───────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'results' | 'ai' | 'explain'>('results');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [runningType, setRunningType] = useState<'all' | 'selected'>('all');
  const [execData, setExecData] = useState<{
    columns: string[];
    rows: Record<string, unknown>[];
    error: string | null;
    timeMs: number;
    graded: boolean;
    isCorrect: boolean | null;
    verdict: string;
    rowCount: number;
    truncated: boolean;
    canonicalSql?: string | null;
    canonicalRowCount?: number | null;
  }>({ columns: [], rows: [], error: null, timeMs: 0, graded: false, isCorrect: null, verdict: 'ungraded', rowCount: 0, truncated: false });

  // ── Per-question learning state ───────────────────────────────────────────
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [solvedThisSession, setSolvedThisSession] = useState<Set<string>>(new Set());

  // ── AI Coach ──────────────────────────────────────────────────────────────
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiCopied, setAiCopied] = useState(false);

  // ── EXPLAIN ───────────────────────────────────────────────────────────────
  const [explainData, setExplainData] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  // ── Guide modal ───────────────────────────────────────────────────────────
  const [showGuide, setShowGuide] = useState(false);

  // ─── Auto-select first question on load ──────────────────────────────────
  useEffect(() => {
    if (!currentQ && questions.length > 0) setCurrentQ(questions[0]);
  }, [questions, currentQ]);

  // ─── Reset per-question state when question changes ───────────────────────
  useEffect(() => {
    if (!currentQ) return;
    const starter = '';  // blank editor — learner writes from scratch
    sqlTextRef.current = starter;
    setSqlText(starter);
    if (editorRef.current) editorRef.current.setValue(starter);
    setHasRun(false);
    setShowHint(false);
    setShowAI(false);
    setAiAnalysis(null);
    setAiError(null);
    setExplainData(null);
    setExplainError(null);
    setWrongAttempts(0);
    setExecData({ columns: [], rows: [], error: null, timeMs: 0, graded: false, isCorrect: null, verdict: 'ungraded', rowCount: 0, truncated: false });
    setActiveTab('results');
    setExpandedTable(null);
  }, [currentQ]);

  // ─── Filtered question list ───────────────────────────────────────────────
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterDb !== 'all' && q.db !== filterDb) return false;
      if (filterDiff !== 'all' && q.difficulty !== filterDiff) return false;
      if (filterTopic !== 'all' && q.topic !== filterTopic) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        return q.title.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s);
      }
      return true;
    });
  }, [questions, filterDb, filterDiff, filterTopic, search]);

  const solutionUnlocked = wrongAttempts >= 2;

  // ─── SQL helpers ──────────────────────────────────────────────────────────
  const setSql = (sql: string) => {
    sqlTextRef.current = sql;
    setSqlText(sql);
    if (editorRef.current) editorRef.current.setValue(sql);
  };

  const handleFormat = () => {
    try { setSql(formatSql(sqlTextRef.current, { language: 'mysql' })); }
    catch { /* ignore */ }
  };

  const handleReset = () => {
    if (!currentQ) return;
    setSql(`-- ${currentQ.title}\n`);
    setHasRun(false);
  };

  const handleShowSolution = async () => {
    if (!currentQ) return;
    try {
      const res = await fetch(`${API_BASE}/api/questions/${currentQ.id}/solution`);
      const data = await res.json();
      if (!res.ok || !data.canonicalSql) {
        alert(data.error ?? 'Could not fetch solution.');
        return;
      }
      setSql(data.canonicalSql);
    } catch {
      alert('Could not reach the backend.');
    }
  };

  // ─── Run query ────────────────────────────────────────────────────────────
  const handleRun = async (type: 'all' | 'selected') => {
    if (!currentQ) return;

    let sql = sqlTextRef.current;
    if (type === 'selected' && editorRef.current) {
      const selection = editorRef.current.getModel()?.getValueInRange(editorRef.current.getSelection());
      if (!selection?.trim()) { alert("Highlight some SQL first to use 'Run Selected'."); return; }
      sql = selection;
    }

    setRunningType(type);
    setIsRunning(true);
    setHasRun(false);
    setShowAI(false);
    setAiAnalysis(null);
    setAiError(null);

    try {
      const t0 = Date.now();
      const res = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, database: currentQ.db, questionId: currentQ.id }),
      });
      const data = await res.json().catch(() => ({}));
      const elapsed = Date.now() - t0;

      if (!res.ok || data.error) {
        setExecData({
          columns: [], rows: [], error: data.error ?? `Request failed (${res.status})`,
          timeMs: data.executionTimeMs ?? elapsed,
          graded: false, isCorrect: null, verdict: 'error',
          rowCount: 0, truncated: false,
        });
      } else {
        const isCorrect = data.isCorrect ?? null;
        const verdict = data.verdict ?? 'ungraded';
        setExecData({
          columns: data.columns ?? [],
          rows: data.rows ?? [],
          error: null,
          timeMs: data.executionTimeMs ?? elapsed,
          graded: data.graded ?? false,
          isCorrect,
          verdict,
          rowCount: data.rowCount ?? (data.rows?.length ?? 0),
          truncated: data.truncated ?? false,
          canonicalSql: data.canonicalSql ?? null,
          canonicalRowCount: data.canonicalRowCount ?? null,
        });

        if (data.graded && isCorrect === false) {
          setWrongAttempts((n) => n + 1);
        }
        if (data.graded && isCorrect === true) {
          setSolvedThisSession((prev) => new Set([...prev, currentQ.id]));
        }
      }
    } catch {
      setExecData({ columns: [], rows: [], error: 'Could not connect to execution engine.', timeMs: 0, graded: false, isCorrect: null, verdict: 'error', rowCount: 0, truncated: false });
    }

    setIsRunning(false);
    setHasRun(true);
    setActiveTab('results');
  };

  // ─── Ctrl/Cmd + Enter ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun('all'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // ─── EXPLAIN ─────────────────────────────────────────────────────────────
  const handleExplain = async () => {
    if (!currentQ) return;
    setExplainLoading(true);
    setExplainError(null);
    setExplainData(null);
    setActiveTab('explain');
    try {
      const res = await fetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: sqlTextRef.current, database: currentQ.db }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) setExplainError(data.error ?? 'EXPLAIN failed');
      else setExplainData(JSON.stringify(data.explain, null, 2));
    } catch { setExplainError('Could not reach the backend.'); }
    setExplainLoading(false);
  };

  // ─── AI Coach ────────────────────────────────────────────────────────────
  const handleAI = async () => {
    if (!currentQ) return;
    setAiLoading(true);
    setAiError(null);
    setAiAnalysis(null);
    setAiCopied(false);
    setActiveTab('ai');
    try {
      const res = await fetch(`${API_BASE}/api/ai-coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sql: sqlText,
          questionId: currentQ.id,
          questionTitle: currentQ.title,
          questionPrompt: currentQ.prompt,
          canonicalSql: execData.canonicalSql ?? null,
          executionError: execData.error,
          graded: execData.graded,
          isCorrect: execData.isCorrect ?? null,
          verdict: execData.verdict,
          rowCount: execData.rowCount,
          canonicalRowCount: execData.canonicalRowCount ?? null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setAiError(data.error ?? 'AI request failed'); }
      else { setAiAnalysis(data.analysis ?? ''); setAiModel(data.model ?? null); setShowAI(true); }
    } catch { setAiError('Could not reach the AI coach. Is the backend running?'); }
    setAiLoading(false);
    setShowAI(true);
  };

  const handleCopyAI = async () => {
    if (!aiAnalysis) return;
    await navigator.clipboard.writeText(aiAnalysis).catch(() => {});
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  // ─── CSV export ───────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!execData.rows.length) return;
    const cols = execData.columns.length ? execData.columns : Object.keys(execData.rows[0]);
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [cols.map(esc).join(','), ...execData.rows.map((r) => cols.map((c) => esc(String((r as any)[c] ?? ''))).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'results.csv';
    a.click();
  };

  // ─── Verdict badge ────────────────────────────────────────────────────────
  const verdictBadge = () => {
    if (execData.error) return { label: 'ERROR', cls: 'bg-rose-100 text-rose-700 border-rose-200' };
    if (!execData.graded) return { label: 'EXECUTED', cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    if (execData.isCorrect) return { label: '✓ CORRECT', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    return { label: '✗ WRONG ANSWER', cls: 'bg-amber-100 text-amber-700 border-amber-200' };
  };

  // ─── Loading / error screen ───────────────────────────────────────────────
  if (qLoading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-3" />
      <span className="text-slate-600 text-sm font-medium">Loading questions…</span>
    </div>
  );
  if (qError) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-3">
      <X className="w-8 h-8 text-rose-500" />
      <p className="text-slate-700 font-medium">Failed to load questions</p>
      <p className="text-slate-500 text-sm">{qError}</p>
      <p className="text-slate-400 text-xs">Is the backend running at {API_BASE}?</p>
    </div>
  );

  const badge = hasRun ? verdictBadge() : null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white shadow-sm flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 p-1.5 rounded-lg"><Database className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-slate-900 text-sm hidden sm:block">SQL Practice</span>
          </Link>
          <div className="hidden sm:block w-px h-4 bg-slate-200" />
          {/* Database selector — quick filter in header */}
          <select
            value={filterDb}
            onChange={(e) => setFilterDb(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg py-1.5 px-3 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            title="Filter by database"
          >
            <option value="all">All Databases</option>
            {databases.map((d) => (
              <option key={d} value={d}>{DB_LABELS[d] ?? d}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:block">
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            {solvedThisSession.size > 0 && <> · <span className="text-emerald-600 font-semibold">{solvedThisSession.size} solved</span></>}
          </span>
          <button onClick={() => setShowGuide(true)} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors">
            <BookOpen className="w-3.5 h-3.5" /><span className="hidden sm:inline">SQL Guide</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Panel ──────────────────────────────────────────────────── */}
        <aside className="w-72 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
          {/* Left panel tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setLeftTab('questions')}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${leftTab === 'questions' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >Questions</button>
            <button
              onClick={() => setLeftTab('schema')}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${leftTab === 'schema' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >Schema</button>
          </div>

          {leftTab === 'questions' && (
            <>
              {/* Filters */}
              <div className="p-2 border-b border-slate-100 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions…"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setFilterDiff(d)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
                        filterDiff === d
                          ? d === 'all' ? 'bg-slate-700 text-white border-slate-700'
                            : d === 'easy' ? 'bg-emerald-600 text-white border-emerald-600'
                            : d === 'medium' ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <select
                    value={filterDb}
                    onChange={(e) => setFilterDb(e.target.value)}
                    className="flex-1 text-xs border border-slate-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
                  >
                    <option value="all">All databases</option>
                    {databases.map((d) => <option key={d} value={d}>{DB_LABELS[d] ?? d}</option>)}
                  </select>
                  <select
                    value={filterTopic}
                    onChange={(e) => setFilterTopic(e.target.value)}
                    className="flex-1 text-xs border border-slate-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
                  >
                    <option value="all">All topics</option>
                    {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Question list */}
              <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
                {filteredQuestions.length === 0 && (
                  <p className="text-center text-slate-400 text-xs py-8">No questions match your filters.</p>
                )}
                {filteredQuestions.map((q) => {
                  const isCurrent = currentQ?.id === q.id;
                  const isSolved = solvedThisSession.has(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQ(q)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${isCurrent ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {isSolved
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            : <Circle className={`w-3.5 h-3.5 ${isCurrent ? 'text-indigo-400' : 'text-slate-300'}`} />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-indigo-800' : 'text-slate-700'}`}>{q.title}</p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${DIFF_PILL[q.difficulty]}`}>
                              {q.difficulty.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">{q.topic}</span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] text-slate-400">{DB_LABELS[q.db] ?? q.db}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {leftTab === 'schema' && (
            <div className="flex-1 overflow-y-auto p-2">
              {!activeSchemaDb && <p className="text-xs text-slate-400 text-center py-8">Select a database or question to see its schema.</p>}
              {activeSchemaDb && schemaLoading && (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-xs text-slate-500">Loading schema…</span>
                </div>
              )}
              {activeSchemaDb && !schemaLoading && (
                <>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">{activeSchemaDb} Database</p>
                  {tables.map((table) => (
                    <div key={table.name}>
                      <button
                        onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-md text-xs text-slate-700 font-medium transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Table2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{table.name}</span>
                        </div>
                        {expandedTable === table.name ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                      </button>
                      {expandedTable === table.name && (
                        <div className="pl-7 py-1 space-y-1.5 border-l-2 border-slate-100 ml-4 mt-0.5 mb-1">
                          {table.columns.map((col) => (
                            <div key={col.name} className="flex justify-between items-center pr-2">
                              <span className={`text-[10px] font-medium ${col.key === 'PRI' ? 'text-amber-700' : 'text-slate-600'}`}>{col.name}</span>
                              <div className="flex gap-1">
                                {col.key === 'PRI' && <span className="text-[8px] font-bold text-orange-600 bg-orange-100 px-1 rounded">PK</span>}
                                {col.key === 'MUL' && <span className="text-[8px] font-bold text-blue-600 bg-blue-100 px-1 rounded">FK</span>}
                                <span className="text-[9px] text-slate-400 font-mono">{col.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </aside>

        {/* ── Main Panel ──────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {!currentQ && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <SlidersHorizontal className="w-10 h-10 mb-3 text-slate-200" />
              <p className="font-medium text-sm">Select a question from the left panel</p>
            </div>
          )}

          {currentQ && (
            <>
              {/* Top half: question + editor */}
              <div className="flex-1 flex flex-col xl:flex-row border-b border-slate-200 min-h-0">

                {/* Question panel */}
                <div className="xl:w-[42%] flex flex-col border-b xl:border-b-0 xl:border-r border-slate-200 min-h-[220px] xl:min-h-0">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider flex-shrink-0">Task</span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold border border-indigo-200 flex-shrink-0">{currentQ.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${DIFF_PILL[currentQ.difficulty]}`}>{currentQ.difficulty.toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400 truncate">{currentQ.topic}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{DB_LABELS[currentQ.db] ?? currentQ.db}</span>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto">
                    <h2 className="text-lg font-bold text-slate-800 mb-3">{currentQ.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{renderPrompt(currentQ.prompt)}</p>

                    {/* Hint */}
                    <div className="mt-5 border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-amber-600"><Lightbulb className="w-3.5 h-3.5" />Hint</div>
                        {showHint ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      {showHint && (
                        <div className="px-4 py-3 bg-amber-50 border-t border-slate-200 text-xs text-slate-700 leading-relaxed">
                          {currentQ.hint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Editor panel */}
                <div className="flex-1 flex flex-col min-h-[240px] xl:min-h-0">
                  <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SQL Editor</span>
                    <div className="flex gap-1">
                      <button onClick={handleFormat} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Format SQL"><Wand2 className="w-3.5 h-3.5" /></button>
                      <button onClick={handleReset} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Reset"><RotateCcw className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      defaultLanguage="sql"
                      value={sqlText}
                      onChange={(val) => { sqlTextRef.current = val ?? ''; setSqlText(val ?? ''); }}
                      onMount={(editor, monaco) => {
                        editorRef.current = editor;
                        // Dispose previous provider if remounted
                        completionDisposableRef.current?.dispose();
                        completionDisposableRef.current = monaco.languages.registerCompletionItemProvider('sql', {
                          triggerCharacters: [' ', '.', '(', '\n'],
                          provideCompletionItems: (_model: any, position: any, _ctx: any) => {
                            const word = _model.getWordUntilPosition(position);
                            const range = {
                              startLineNumber: position.lineNumber,
                              endLineNumber: position.lineNumber,
                              startColumn: word.startColumn,
                              endColumn: word.endColumn,
                            };
                            const K = monaco.languages.CompletionItemKind;
                            const suggestions: any[] = [];

                            // ── SQL Keywords & clauses ──────────────────────
                            const keywords = [
                              'SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN',
                              'INNER JOIN','OUTER JOIN','ON','AS','GROUP BY','ORDER BY',
                              'HAVING','LIMIT','OFFSET','DISTINCT','UNION','UNION ALL',
                              'WITH','INSERT INTO','UPDATE','SET','DELETE FROM',
                              'CASE','WHEN','THEN','ELSE','END','AND','OR','NOT',
                              'IN','NOT IN','EXISTS','NOT EXISTS','BETWEEN','LIKE',
                              'IS NULL','IS NOT NULL','ASC','DESC',
                            ];
                            keywords.forEach(kw => suggestions.push({
                              label: kw, kind: K.Keyword,
                              insertText: kw, range,
                            }));

                            // ── SQL Functions ───────────────────────────────
                            const functions: [string, string][] = [
                              ['COUNT(*)', 'COUNT(*)'],
                              ['COUNT(DISTINCT ${1:col})', 'COUNT(DISTINCT ...)'],
                              ['SUM(${1:col})', 'SUM(...)'],
                              ['AVG(${1:col})', 'AVG(...)'],
                              ['MIN(${1:col})', 'MIN(...)'],
                              ['MAX(${1:col})', 'MAX(...)'],
                              ['ROUND(${1:val}, ${2:decimals})', 'ROUND(val, decimals)'],
                              ['COALESCE(${1:val}, ${2:default})', 'COALESCE(val, default)'],
                              ['DATE_FORMAT(${1:col}, \'%Y-%m\')', 'DATE_FORMAT(col, fmt)'],
                              ['CURDATE()', 'CURDATE()'],
                              ['NOW()', 'NOW()'],
                              ['ABS(${1:col})', 'ABS(col)'],
                              ['LENGTH(${1:col})', 'LENGTH(col)'],
                              ['UPPER(${1:col})', 'UPPER(col)'],
                              ['LOWER(${1:col})', 'LOWER(col)'],
                              ['ROW_NUMBER() OVER (${1:PARTITION BY col ORDER BY col})', 'ROW_NUMBER() OVER (...)'],
                              ['RANK() OVER (${1:PARTITION BY col ORDER BY col})', 'RANK() OVER (...)'],
                              ['DENSE_RANK() OVER (${1:PARTITION BY col ORDER BY col})', 'DENSE_RANK() OVER (...)'],
                              ['SUM(${1:col}) OVER (${2:PARTITION BY col ORDER BY col})', 'SUM() OVER (...)'],
                              ['LAG(${1:col}, 1) OVER (${2:ORDER BY col})', 'LAG(col, 1) OVER (...)'],
                              ['LEAD(${1:col}, 1) OVER (${2:ORDER BY col})', 'LEAD(col, 1) OVER (...)'],
                            ];
                            functions.forEach(([snippet, label]) => suggestions.push({
                              label, kind: K.Function,
                              insertText: snippet,
                              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                              range,
                            }));

                            // ── Table & column names from live schema ───────
                            schemaRef.current.forEach(table => {
                              suggestions.push({
                                label: table.name,
                                kind: K.Class,
                                detail: `Table (${table.columns.length} columns)`,
                                insertText: table.name,
                                range,
                              });
                              table.columns.forEach(col => {
                                suggestions.push({
                                  label: col.name,
                                  kind: K.Field,
                                  detail: `${table.name}.${col.name}  ${col.type}${col.key === 'PRI' ? ' 🔑' : col.key === 'MUL' ? ' FK' : ''}`,
                                  insertText: col.name,
                                  range,
                                });
                              });
                            });

                            return { suggestions };
                          },
                        });
                      }}
                      theme="light"
                      options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', lineNumbers: 'on', scrollBeyondLastLine: false, quickSuggestions: true }}
                    />
                  </div>

                  {/* Action bar */}
                  <div className="px-3 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {/* Show Solution gated */}
                      <button
                        onClick={handleShowSolution}
                        disabled={!solutionUnlocked}
                        title={solutionUnlocked ? 'Show solution' : `Submit ${2 - wrongAttempts} more wrong answer${2 - wrongAttempts !== 1 ? 's' : ''} to unlock`}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${solutionUnlocked ? 'text-slate-600 hover:text-indigo-700 border-slate-200 hover:border-indigo-200 bg-slate-50 hover:bg-indigo-50' : 'text-slate-300 border-slate-100 cursor-not-allowed'}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Solution</span>
                        {!solutionUnlocked && wrongAttempts > 0 && <Shield className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 hidden xl:block"><kbd className="bg-slate-100 border border-slate-200 px-1.5 rounded text-[10px]">⌘↵</kbd> Run</span>
                      <button
                        onClick={handleExplain}
                        disabled={isRunning || explainLoading}
                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-colors"
                        title="Run EXPLAIN on your query"
                      >
                        {explainLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">Explain</span>
                      </button>
                      <button
                        onClick={() => handleRun('selected')}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-colors"
                      >
                        Run Selection
                      </button>
                      <button
                        onClick={() => handleRun('all')}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors shadow-sm shadow-indigo-600/20"
                      >
                        {isRunning ? <><Loader2 className="w-4 h-4 animate-spin" />Running…</> : <><Play className="w-4 h-4 fill-current" />Run Query</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom half: results */}
              <div className="h-64 xl:h-72 flex flex-col bg-white flex-shrink-0">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-1.5 gap-1 flex-shrink-0">
                  {(['results', 'ai', 'explain'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === t ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                    >
                      {t === 'results' && 'Output'}
                      {t === 'ai' && <><BrainCircuit className="w-3.5 h-3.5" />AI Coach</>}
                      {t === 'explain' && 'Execution Plan'}
                    </button>
                  ))}
                  {hasRun && badge && (
                    <div className="ml-auto flex items-center gap-2 px-2 pb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>{badge.label}</span>
                      <span className="text-[10px] text-slate-400">{execData.timeMs}ms · {execData.rowCount} row{execData.rowCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-3 text-sm">

                  {/* Results tab */}
                  {activeTab === 'results' && (
                    !hasRun && !isRunning ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <Play className="w-8 h-8 mb-2" />
                        <span className="text-xs">Run your query to see results</span>
                      </div>
                    ) : execData.error ? (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm text-rose-700 flex gap-2">
                        <X className="w-4 h-4 shrink-0 mt-0.5" />
                        <pre className="whitespace-pre-wrap break-words font-sans text-xs">{execData.error}</pre>
                      </div>
                    ) : (
                      <div>
                        {execData.rows.length > 0 && (
                          <div className="flex justify-end mb-2">
                            <button onClick={handleExport} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 border border-slate-200 px-2 py-1 rounded transition-colors">
                              <Download className="w-3 h-3" />CSV
                            </button>
                          </div>
                        )}
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                {(execData.columns.length ? execData.columns : Object.keys(execData.rows[0] ?? {})).map((col) => (
                                  <th key={col} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-r last:border-r-0 border-slate-200">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {execData.rows.length === 0 ? (
                                <tr><td colSpan={100} className="px-4 py-6 text-center text-slate-400 italic">No rows returned</td></tr>
                              ) : execData.rows.map((row, i) => (
                                <tr key={i} className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50">
                                  {(execData.columns.length ? execData.columns : Object.keys(row)).map((col) => (
                                    <td key={col} className="px-3 py-1.5 text-slate-700 font-mono whitespace-nowrap border-r last:border-r-0 border-slate-100 max-w-[200px] truncate">
                                      {row[col] == null ? <span className="text-slate-300 italic">NULL</span> : String(row[col])}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {execData.truncated && <p className="text-[10px] text-slate-400 mt-1 text-center">Results truncated — showing first 2000 rows</p>}
                      </div>
                    )
                  )}

                  {/* AI Coach tab */}
                  {activeTab === 'ai' && (
                    <div className="max-w-2xl">
                      {!hasRun && !showAI ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300 py-6">
                          <BrainCircuit className="w-8 h-8 mb-2" />
                          <span className="text-xs">Run your query first, then get AI feedback</span>
                        </div>
                      ) : !showAI ? (
                        <div className="flex flex-col items-center gap-3 py-4">
                          <p className="text-xs text-slate-600">Get AI feedback on your query approach, mistakes, and improvements.</p>
                          <button
                            onClick={handleAI}
                            disabled={aiLoading}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
                          >
                            {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</> : <><BrainCircuit className="w-4 h-4" />Ask AI Coach</>}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-purple-500 p-1 rounded text-white"><BrainCircuit className="w-3.5 h-3.5" /></div>
                              <span className="text-xs font-semibold text-slate-700">AI Coach{aiModel ? ` · ${aiModel}` : ''}</span>
                            </div>
                            <div className="flex gap-2">
                              {aiAnalysis && !aiError && (
                                <button onClick={handleCopyAI} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 border border-slate-200 px-2 py-1 rounded transition-colors">
                                  {aiCopied ? <><Check className="w-3 h-3 text-emerald-600" /><span className="text-emerald-600">Copied</span></> : <><Copy className="w-3 h-3" />Copy</>}
                                </button>
                              )}
                              <button onClick={handleAI} disabled={aiLoading} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 border border-slate-200 px-2 py-1 rounded transition-colors disabled:opacity-50">
                                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}Retry
                              </button>
                            </div>
                          </div>
                          {aiError ? (
                            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{aiError}</p>
                          ) : (
                            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {aiAnalysis || <span className="text-slate-300 italic">No response returned.</span>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* EXPLAIN tab */}
                  {activeTab === 'explain' && (
                    explainLoading ? (
                      <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" /><span className="text-xs">Running EXPLAIN…</span>
                      </div>
                    ) : explainError ? (
                      <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{explainError}</div>
                    ) : explainData ? (
                      <div className="bg-slate-900 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
                          <span className="text-[10px] font-mono text-slate-400">EXPLAIN FORMAT=JSON</span>
                          <button onClick={() => navigator.clipboard.writeText(explainData ?? '')} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"><Copy className="w-3 h-3" />Copy</button>
                        </div>
                        <pre className="p-3 text-[10px] font-mono text-emerald-300 overflow-auto max-h-40 leading-relaxed">{explainData}</pre>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-300">
                        <Shield className="w-8 h-8 mb-2" />
                        <span className="text-xs">Click <strong className="text-slate-500">Explain</strong> above to see the execution plan</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── Guide Modal ──────────────────────────────────────────────────── */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowGuide(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600" /><span className="font-bold text-slate-800">SQL Guide & Shortcuts</span></div>
              <button onClick={() => setShowGuide(false)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              <div>
                <h3 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider">Keyboard Shortcuts</h3>
                <div className="space-y-2">
                  {[['Ctrl / Cmd + Enter', 'Run full query'], ['Ctrl + Z', 'Undo'], ['Ctrl + Shift + K', 'Delete line'], ['Alt + Shift + F', 'Format']].map(([k, d]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-slate-600">{d}</span>
                      <kbd className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs font-mono">{k}</kbd>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider">SQL Quick Reference</h3>
                <div className="space-y-3 text-slate-600 leading-relaxed text-xs">
                  <p><strong className="text-slate-800">Window functions:</strong> <code className="bg-slate-100 px-1 rounded">ROW_NUMBER() OVER (PARTITION BY … ORDER BY …)</code> — rank rows within groups without collapsing them.</p>
                  <p><strong className="text-slate-800">CTEs:</strong> <code className="bg-slate-100 px-1 rounded">WITH cte AS (SELECT …)</code> — name a subquery for reuse and readability.</p>
                  <p><strong className="text-slate-800">Half-open date ranges:</strong> <code className="bg-slate-100 px-1 rounded">date &gt;= '2024-01-01' AND date &lt; '2024-02-01'</code> — correct, index-friendly date filtering.</p>
                  <p><strong className="text-slate-800">EXISTS vs IN:</strong> <code className="bg-slate-100 px-1 rounded">EXISTS</code> short-circuits and is faster on large correlated subqueries.</p>
                  <p><strong className="text-slate-800">Execution order:</strong> <code className="bg-slate-100 px-1 rounded">FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code></p>
                  <p><strong className="text-slate-800">Aggregation:</strong> Columns in SELECT must be in GROUP BY or inside an aggregate (COUNT, SUM, AVG, MIN, MAX).</p>
                  <p><strong className="text-slate-800">NULL:</strong> <code className="bg-slate-100 px-1 rounded">NULL != NULL</code> — use <code className="bg-slate-100 px-1 rounded">IS NULL</code> / <code className="bg-slate-100 px-1 rounded">IS NOT NULL</code>.</p>
                  <p><strong className="text-slate-800">Tip:</strong> Use the <em>Explain</em> button to see MySQL's query execution plan and spot full table scans.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
