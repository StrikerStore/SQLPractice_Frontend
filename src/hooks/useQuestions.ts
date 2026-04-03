'use client';

import { useState, useEffect, useRef } from 'react';
import type { Question, QuestionsResponse, Level, LevelsResponse } from '../types/question';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface UseQuestionsState {
  questions: Question[];
  databases: string[];
  levels: Level[];
  loading: boolean;
  error: string | null;
  total: number;
}

export function useQuestions() {
  const [state, setState] = useState<UseQuestionsState>({
    questions: [],
    databases: [],
    levels: [],
    loading: true,
    error: null,
    total: 0,
  });

  const cacheQ = useRef<QuestionsResponse | null>(null);
  const cacheL = useRef<LevelsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        // Load questions and levels in parallel
        const promises: Promise<void>[] = [];

        if (!cacheQ.current) {
          promises.push(
            fetch(`${API_BASE}/api/questions`)
              .then((r) => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json(); })
              .then((d) => { cacheQ.current = d as QuestionsResponse; }),
          );
        }
        if (!cacheL.current) {
          promises.push(
            fetch(`${API_BASE}/api/questions/levels`)
              .then((r) => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json(); })
              .then((d) => { cacheL.current = d as LevelsResponse; }),
          );
        }

        await Promise.all(promises);

        if (!cancelled) {
          setState({
            questions: cacheQ.current!.questions,
            databases: cacheQ.current!.filters.databases,
            levels: cacheL.current!.levels,
            total: cacheQ.current!.count,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load questions',
          }));
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
