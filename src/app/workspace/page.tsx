"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Database, Play, RotateCcw, Download, Table2, Lightbulb,
  ChevronRight, ChevronDown, BrainCircuit, Loader2, X, Eye,
  Wand2, BookOpen, Shield, Search, SlidersHorizontal,
  CheckCircle2, Circle, Code2, ListChecks, SquareTerminal, ChevronUp,
  BookMarked, Copy, LogOut,
} from 'lucide-react';
import { clearAuth, getUser } from '@/lib/auth';
import { useQuestions } from '../../hooks/useQuestions';
import { useSchema } from '../../hooks/useSchema';
import { useBuildConcept } from '../../hooks/useBuildConcept';
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
};

export default function Workspace() {
  const router = useRouter();
  const currentUser = getUser();

  const handleLogout = useCallback(() => {
    clearAuth();
    router.push('/login');
  }, [router]);
  // ── Question browser state ────────────────────────────────────────────────
  const { questions, databases, levels, loading: qLoading, error: qError } = useQuestions();
  const [filterDb, setFilterDb] = useState<string>('all');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'all'>('all');
  const [search, setSearch] = useState('');
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1]));
  const [expandedLearningCard, setExpandedLearningCard] = useState<number | null>(null);

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
  const [activeTab, setActiveTab] = useState<'results' | 'build' | 'explain'>('results');
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

  // ── Build Concept ─────────────────────────────────────────────────────────
  const buildConcept = useBuildConcept(currentQ?.id ?? null);

  // ── EXPLAIN ───────────────────────────────────────────────────────────────
  const [explainData, setExplainData] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  // ── Guide modal ───────────────────────────────────────────────────────────
  const [showGuide, setShowGuide] = useState(false);

  // ── Mobile navigation ─────────────────────────────────────────────────────
  const [mobileTab, setMobileTab] = useState<'questions' | 'task' | 'editor' | 'output'>('questions');

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
    setExplainData(null);
    setExplainError(null);
    setWrongAttempts(0);
    setExecData({ columns: [], rows: [], error: null, timeMs: 0, graded: false, isCorrect: null, verdict: 'ungraded', rowCount: 0, truncated: false });
    setActiveTab('results');
    setExpandedTable(null);
    buildConcept.reset();
  }, [currentQ]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Filtered question list ───────────────────────────────────────────────
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterDb !== 'all' && q.db !== filterDb) return false;
      if (filterDiff !== 'all' && q.difficulty !== filterDiff) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        const lvlTitle = levels.find(l => l.level_id === q.level_id)?.title ?? '';
        return q.title.toLowerCase().includes(s) || lvlTitle.toLowerCase().includes(s);
      }
      return true;
    });
  }, [questions, filterDb, filterDiff, search, levels]);

  // ─── Level helpers ────────────────────────────────────────────────────────
  const toggleLevel = (id: number) => {
    setExpandedLevels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleLearningCard = (id: number) =>
    setExpandedLearningCard(prev => prev === id ? null : id);

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
            <div className="bg-indigo-600 p-1.5 rounded-lg"><Code2 className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-slate-900 text-sm hidden sm:block">LearnMyCode – SQL</span>
          </Link>
          <div className="hidden sm:block w-px h-4 bg-slate-200" />
          {/* Database selector — quick filter in header */}
          <select
            value={filterDb}
            onChange={(e) => setFilterDb(e.target.value)}
            className="hidden md:block text-xs font-medium border border-slate-200 rounded-lg py-1.5 px-3 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
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
          {currentUser && (
            <span className="hidden md:block text-xs font-medium text-slate-500 border-l border-slate-200 pl-2">
              {currentUser.full_name.split(' ')[0]}
            </span>
          )}
          <button
            onClick={handleLogout}
            title="Sign out"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="hidden md:flex flex-1 overflow-hidden">

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
                </div>
              </div>

              {/* Level-grouped question list */}
              <div className="flex-1 overflow-y-auto">
                {filteredQuestions.length === 0 && (
                  <p className="text-center text-slate-400 text-xs py-8">No questions match your filters.</p>
                )}
                {levels.map((lvl) => {
                  const lvlQs = filteredQuestions.filter(q => q.level_id === lvl.level_id);
                  if (lvlQs.length === 0) return null;
                  const isOpen = expandedLevels.has(lvl.level_id);
                  const isCardOpen = expandedLearningCard === lvl.level_id;
                  const solvedCount = lvlQs.filter(q => solvedThisSession.has(q.id)).length;
                  return (
                    <div key={lvl.level_id} className="border-b border-slate-100 last:border-0">
                      {/* Level header */}
                      <button
                        onClick={() => toggleLevel(lvl.level_id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded flex-shrink-0">L{lvl.level_id}</span>
                          <span className="text-xs font-semibold text-slate-700 truncate">{lvl.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{solvedCount}/{lvlQs.length}</span>
                      </button>

                      {isOpen && (
                        <div>
                          {/* Learning card toggle */}
                          <button
                            onClick={() => toggleLearningCard(lvl.level_id)}
                            className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <BookMarked className="w-3 h-3" />
                            {isCardOpen ? 'Hide learning card' : 'Show learning card'}
                          </button>

                          {/* Inline learning card */}
                          {isCardOpen && (
                            <div className="mx-2 mb-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs space-y-2">
                              <p className="text-slate-700 leading-relaxed">{lvl.description.slice(0, 180)}{lvl.description.length > 180 ? '…' : ''}</p>
                              <div className="pt-1 border-t border-indigo-100">
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Tip</p>
                                <p className="text-slate-600 leading-relaxed">{lvl.tips.split('\n')[0]}</p>
                              </div>
                            </div>
                          )}

                          {/* Questions in this level */}
                          <div className="pb-1">
                            {lvlQs.map((q) => {
                              const isCurrent = currentQ?.id === q.id;
                              const isSolved = solvedThisSession.has(q.id);
                              return (
                                <button
                                  key={q.id}
                                  onClick={() => setCurrentQ(q)}
                                  className={`w-full text-left px-3 py-2 transition-colors group ${isCurrent ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : 'hover:bg-slate-50 border-l-2 border-l-transparent'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0">
                                      {isSolved
                                        ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        : <Circle className={`w-3 h-3 ${isCurrent ? 'text-indigo-400' : 'text-slate-300'}`} />
                                      }
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className={`text-xs font-medium truncate ${isCurrent ? 'text-indigo-800' : 'text-slate-700'}`}>{q.title}</p>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${DIFF_PILL[q.difficulty]}`}>{q.difficulty.toUpperCase()}</span>
                                        <span className="text-[9px] text-slate-400">{DB_LABELS[q.db] ?? q.db}</span>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
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
                      <span className="text-[10px] text-slate-400 truncate">{levels.find(l => l.level_id === currentQ.level_id)?.title ?? ''}</span>
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
                  {(['results', 'build', 'explain'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === t ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                    >
                      {t === 'results' && 'Output'}
                      {t === 'build' && <><BrainCircuit className="w-3.5 h-3.5" />Build Concept</>}
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

                  {/* Build Concept tab */}
                  {activeTab === 'build' && (
                    <div className="max-w-2xl space-y-3">
                      {buildConcept.steps.length === 0 && !buildConcept.loading && !buildConcept.error && (
                        <div className="flex flex-col items-center gap-3 py-6">
                          <BrainCircuit className="w-8 h-8 text-indigo-300" />
                          <p className="text-xs text-slate-500 text-center max-w-xs">Load a step-by-step thinking guide for this question.</p>
                          <button
                            onClick={buildConcept.load}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <BrainCircuit className="w-3.5 h-3.5" />Load Thinking Guide
                          </button>
                        </div>
                      )}
                      {buildConcept.loading && (
                        <div className="flex items-center gap-2 py-6 justify-center text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs">Loading…</span>
                        </div>
                      )}
                      {buildConcept.error && (
                        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{buildConcept.error}</p>
                      )}
                      {buildConcept.steps.slice(0, buildConcept.revealedCount).map((s) => (
                        <div key={s.step} className="border border-indigo-100 bg-indigo-50/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold bg-indigo-600 text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">{s.step}</span>
                            <span className="text-xs font-semibold text-indigo-800">{s.title}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed ml-6">{s.body}</p>
                        </div>
                      ))}
                      {buildConcept.steps.length > 0 && buildConcept.revealedCount < buildConcept.steps.length && (
                        <div className="flex gap-2">
                          <button
                            onClick={buildConcept.revealNext}
                            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />Next Step
                          </button>
                          <button
                            onClick={() => { for (let i = buildConcept.revealedCount; i < buildConcept.steps.length; i++) buildConcept.revealNext(); }}
                            className="text-xs text-slate-400 hover:text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Show all
                          </button>
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

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (visible only on screens < md / 768 px)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-1 flex-col overflow-hidden bg-slate-50 relative">

        {/* ── QUESTIONS panel ─────────────────────────────────────────── */}
        {mobileTab === 'questions' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search + filter strip */}
            <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-200 space-y-2.5 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Scrollable chip row: difficulty + databases */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDiff(d)}
                    className={`flex-shrink-0 px-3 py-1 text-[11px] font-bold rounded-full border transition-colors ${
                      filterDiff === d
                        ? d === 'all'    ? 'bg-slate-800 text-white border-slate-800'
                          : d === 'easy'   ? 'bg-emerald-500 text-white border-emerald-500'
                          : d === 'medium' ? 'bg-amber-500  text-white border-amber-500'
                          : 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
                <div className="w-px bg-slate-200 flex-shrink-0 self-stretch my-0.5" />
                {databases.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDb(filterDb === d ? 'all' : d)}
                    className={`flex-shrink-0 px-3 py-1 text-[11px] font-bold rounded-full border transition-colors ${
                      filterDb === d
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {DB_LABELS[d] ?? d}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div className="px-4 py-1.5 flex items-center justify-between bg-slate-50 border-b border-slate-100 flex-shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </span>
              {solvedThisSession.size > 0 && (
                <span className="text-[11px] font-bold text-emerald-600">{solvedThisSession.size} solved ✓</span>
              )}
            </div>

            {/* Question list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredQuestions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                  <SlidersHorizontal className="w-10 h-10 mb-3" />
                  <p className="text-sm text-slate-400">No questions match your filters</p>
                </div>
              )}
              {filteredQuestions.map((q) => {
                const isCurrent = currentQ?.id === q.id;
                const isSolved = solvedThisSession.has(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentQ(q); setMobileTab('task'); }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400">{q.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${DIFF_PILL[q.difficulty]}`}>
                          {q.difficulty.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-indigo-500 font-semibold">{DB_LABELS[q.db] ?? q.db}</span>
                      </div>
                      {isSolved
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        : isCurrent
                          ? <Circle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          : null
                      }
                    </div>
                    <p className={`text-sm font-semibold leading-snug ${isCurrent ? 'text-indigo-800' : 'text-slate-800'}`}>{q.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{levels.find(l => l.level_id === q.level_id)?.title ?? ''}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TASK panel ──────────────────────────────────────────────── */}
        {mobileTab === 'task' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {!currentQ ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ListChecks className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-500 font-medium mb-1">No question selected</p>
                <p className="text-slate-400 text-sm mb-5">Pick one from the Questions tab to get started.</p>
                <button
                  onClick={() => setMobileTab('questions')}
                  className="text-sm text-indigo-600 font-semibold border border-indigo-200 px-4 py-2 rounded-xl bg-indigo-50"
                >
                  Browse Questions →
                </button>
              </div>
            ) : (
              <>
                {/* Question meta bar */}
                <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold border border-indigo-200">{currentQ.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${DIFF_PILL[currentQ.difficulty]}`}>{currentQ.difficulty.toUpperCase()}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{levels.find(l => l.level_id === currentQ.level_id)?.title ?? ''}</span>
                  <span className="text-[11px] text-indigo-500 font-semibold ml-auto">{DB_LABELS[currentQ.db] ?? currentQ.db}</span>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 leading-snug">{currentQ.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{renderPrompt(currentQ.prompt)}</p>

                    {/* Hint accordion */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold bg-white active:bg-slate-50"
                      >
                        <div className="flex items-center gap-2 text-amber-600"><Lightbulb className="w-4 h-4" />Hint</div>
                        {showHint ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {showHint && (
                        <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 text-sm text-slate-700 leading-relaxed">
                          {currentQ.hint ?? 'No hint available for this question.'}
                        </div>
                      )}
                    </div>

                    {/* Table quick-peek */}
                    {tables.length > 0 && (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                          <Table2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{currentQ.db} Schema</span>
                        </div>
                        <div className="p-3 flex flex-wrap gap-2">
                          {tables.map((t) => (
                            <span key={t.name} className="text-[11px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-mono text-slate-700 shadow-sm">
                              {t.name}
                              <span className="text-slate-400 ml-1 text-[10px]">{t.columns.length}c</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
                  <button
                    onClick={() => setMobileTab('editor')}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 active:bg-indigo-700 text-white py-3.5 rounded-2xl font-semibold text-sm shadow-[0_4px_14px_0_rgba(79,70,229,0.35)]"
                  >
                    <Code2 className="w-4 h-4" />
                    Write Query
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── EDITOR panel ────────────────────────────────────────────── */}
        {mobileTab === 'editor' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {!currentQ ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <SquareTerminal className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-500 font-medium mb-4">Select a question first</p>
                <button onClick={() => setMobileTab('questions')} className="text-sm text-indigo-600 font-semibold border border-indigo-200 px-4 py-2 rounded-xl bg-indigo-50">Browse Questions →</button>
              </div>
            ) : (
              <>
                {/* Tappable question summary → goes to task */}
                <button
                  onClick={() => setMobileTab('task')}
                  className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center gap-2 flex-shrink-0 active:bg-slate-50 text-left"
                >
                  <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-indigo-200 flex-shrink-0">{currentQ.id}</span>
                  <span className="text-xs font-semibold text-slate-700 flex-1 truncate">{currentQ.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${DIFF_PILL[currentQ.difficulty]}`}>{currentQ.difficulty.toUpperCase()}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                </button>

                {/* Editor toolbar */}
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SQL Editor</span>
                  <div className="flex items-center gap-1">
                    <button onClick={handleFormat} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors" title="Format SQL">
                      <Wand2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleReset} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors" title="Reset">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleShowSolution}
                      disabled={!solutionUnlocked}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                        solutionUnlocked
                          ? 'text-slate-600 border-slate-200 bg-white active:bg-slate-50'
                          : 'text-slate-300 border-slate-100 cursor-not-allowed'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      {solutionUnlocked ? 'Solution' : `${2 - wrongAttempts} more`}
                    </button>
                  </div>
                </div>

                {/* Textarea SQL editor */}
                <div className="flex-1 overflow-hidden bg-white">
                  <textarea
                    value={sqlText}
                    onChange={(e) => { sqlTextRef.current = e.target.value; setSqlText(e.target.value); }}
                    placeholder={'-- Write your SQL here\nSELECT ...'}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="w-full h-full p-4 text-[13px] text-slate-800 bg-white resize-none focus:outline-none leading-relaxed placeholder-slate-300"
                    style={{ fontFamily: "'SF Mono', 'Fira Code', 'Roboto Mono', 'Courier New', monospace" }}
                  />
                </div>

                {/* Run action bar */}
                <div className="px-3 py-3 bg-white border-t border-slate-200 flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { handleExplain(); setMobileTab('output'); }}
                    disabled={isRunning || explainLoading}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 disabled:opacity-50 active:bg-slate-100 transition-colors flex-shrink-0"
                  >
                    {explainLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                    Explain
                  </button>
                  <button
                    onClick={() => { handleRun('all'); setMobileTab('output'); }}
                    disabled={isRunning}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 active:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 shadow-sm shadow-indigo-600/20 transition-colors"
                  >
                    {isRunning
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Running…</>
                      : <><Play className="w-4 h-4 fill-current" />Run Query</>
                    }
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── OUTPUT panel ────────────────────────────────────────────── */}
        {mobileTab === 'output' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Verdict banner */}
            {hasRun && badge && (
              <div className={`px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-slate-200 ${badge.cls}`}>
                <span className="text-sm font-bold">{badge.label}</span>
                <span className="text-xs font-medium opacity-80">{execData.timeMs}ms · {execData.rowCount} row{execData.rowCount !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Sub-tab bar */}
            <div className="flex border-b border-slate-200 bg-white flex-shrink-0 px-2 pt-1.5 gap-1">
              {(['results', 'build', 'explain'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === t
                      ? 'border-indigo-600 text-indigo-700 bg-white'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  {t === 'results' && 'Output'}
                  {t === 'build' && <><BrainCircuit className="w-3.5 h-3.5" />Build Concept</>}
                  {t === 'explain' && 'Explain'}
                </button>
              ))}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-3 text-sm">

              {/* Results */}
              {activeTab === 'results' && (
                isRunning ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <span className="text-sm">Running query…</span>
                  </div>
                ) : !hasRun ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <Play className="w-10 h-10 mb-3" />
                    <span className="text-sm text-slate-400">Run your query to see results</span>
                    <button onClick={() => setMobileTab('editor')} className="mt-4 text-sm text-indigo-600 font-semibold">← Back to Editor</button>
                  </div>
                ) : execData.error ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-2">
                    <X className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <pre className="whitespace-pre-wrap break-words font-sans text-xs text-rose-700">{execData.error}</pre>
                  </div>
                ) : (
                  <div>
                    {execData.rows.length > 0 && (
                      <div className="flex justify-end mb-2">
                        <button onClick={handleExport} className="flex items-center gap-1 text-[10px] text-slate-500 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <Download className="w-3 h-3" />CSV
                        </button>
                      </div>
                    )}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {(execData.columns.length ? execData.columns : Object.keys(execData.rows[0] ?? {})).map((col) => (
                              <th key={col} className="px-3 py-2.5 text-left font-semibold text-slate-600 whitespace-nowrap border-r last:border-r-0 border-slate-200">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {execData.rows.length === 0 ? (
                            <tr><td colSpan={100} className="px-4 py-8 text-center text-slate-400 italic">No rows returned</td></tr>
                          ) : execData.rows.map((row, i) => (
                            <tr key={i} className="border-b last:border-b-0 border-slate-100">
                              {(execData.columns.length ? execData.columns : Object.keys(row)).map((col) => (
                                <td key={col} className="px-3 py-2 text-slate-700 font-mono whitespace-nowrap border-r last:border-r-0 border-slate-100 max-w-[160px] truncate">
                                  {row[col] == null ? <span className="text-slate-300 italic">NULL</span> : String(row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {execData.truncated && <p className="text-[10px] text-slate-400 mt-2 text-center">Showing first 2 000 rows</p>}
                  </div>
                )
              )}

              {/* Build Concept */}
              {activeTab === 'build' && (
                <div className="space-y-3">
                  {buildConcept.steps.length === 0 && !buildConcept.loading && !buildConcept.error && (
                    <div className="flex flex-col items-center gap-4 py-10">
                      <BrainCircuit className="w-10 h-10 text-indigo-300" />
                      <p className="text-sm text-slate-500 text-center max-w-xs">Load a step-by-step thinking guide for this question.</p>
                      <button
                        onClick={buildConcept.load}
                        className="flex items-center gap-2 bg-indigo-600 active:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-sm"
                      >
                        <BrainCircuit className="w-4 h-4" />Load Thinking Guide
                      </button>
                    </div>
                  )}
                  {buildConcept.loading && (
                    <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                      <span className="text-sm">Loading&hellip;</span>
                    </div>
                  )}
                  {buildConcept.error && (
                    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">{buildConcept.error}</p>
                  )}
                  {buildConcept.steps.slice(0, buildConcept.revealedCount).map((s) => (
                    <div key={s.step} className="border border-indigo-100 bg-indigo-50/50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{s.step}</span>
                        <span className="text-sm font-semibold text-indigo-800">{s.title}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed ml-7">{s.body}</p>
                    </div>
                  ))}
                  {buildConcept.steps.length > 0 && buildConcept.revealedCount < buildConcept.steps.length && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={buildConcept.revealNext}
                        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 border border-indigo-200 px-4 py-2.5 rounded-2xl active:bg-indigo-50"
                      >
                        <ChevronRight className="w-4 h-4" />Next Step
                      </button>
                      <button
                        onClick={() => { for (let i = buildConcept.revealedCount; i < buildConcept.steps.length; i++) buildConcept.revealNext(); }}
                        className="text-sm text-slate-400 border border-slate-200 px-4 py-2.5 rounded-2xl active:bg-slate-50"
                      >
                        Show all
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Explain */}
              {activeTab === 'explain' && (
                explainLoading ? (
                  <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    <span className="text-sm">Running EXPLAIN…</span>
                  </div>
                ) : explainError ? (
                  <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">{explainError}</div>
                ) : explainData ? (
                  <div className="bg-slate-900 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
                      <span className="text-[10px] font-mono text-slate-400">EXPLAIN FORMAT=JSON</span>
                      <button onClick={() => navigator.clipboard.writeText(explainData ?? '')} className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Copy className="w-3 h-3" />Copy
                      </button>
                    </div>
                    <pre className="p-4 text-[10px] font-mono text-emerald-300 overflow-auto leading-relaxed">{explainData}</pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                    <Shield className="w-10 h-10 mb-3" />
                    <span className="text-sm text-slate-400">Use Explain in the editor</span>
                    <button onClick={() => setMobileTab('editor')} className="mt-4 text-sm text-indigo-600 font-semibold">← Back to Editor</button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ── Bottom Navigation Bar ───────────────────────────────────── */}
        <nav className="flex border-t border-slate-200 bg-white flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {([
            { tab: 'questions' as const, icon: ListChecks,      label: 'Questions' },
            { tab: 'task'      as const, icon: BookOpen,         label: 'Task'      },
            { tab: 'editor'    as const, icon: SquareTerminal,   label: 'Editor'    },
            { tab: 'output'    as const, icon: Play,             label: 'Output'    },
          ]).map(({ tab, icon: Icon, label }) => {
            const isActive = mobileTab === tab;
            const showDot = tab === 'output' && hasRun && badge;
            return (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className="relative flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors"
              >
                {showDot && (
                  <span className={`absolute top-2 right-[calc(50%-14px)] w-2 h-2 rounded-full border-2 border-white ${
                    execData.isCorrect ? 'bg-emerald-500' : execData.error ? 'bg-rose-500' : 'bg-amber-400'
                  }`} />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
                {isActive && (
                  <span className="absolute top-0 inset-x-2 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
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
