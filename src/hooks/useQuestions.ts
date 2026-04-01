'use client';

import { useState, useEffect, useRef } from 'react';
import type { Question, QuestionsResponse } from '../types/question';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface UseQuestionsState {
  questions: Question[];
  databases: string[];
  topics: string[];
  loading: boolean;
  error: string | null;
  total: number;
}

export function useQuestions() {
  const [state, setState] = useState<UseQuestionsState>({
    questions: [],
    databases: [],
    topics: [],
    loading: true,
    error: null,
    total: 0,
  });

  // Cache full question list on first load
  const cache = useRef<QuestionsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        // Load all questions once — filtering done client-side for snappy UX
        if (!cache.current) {
          const res = await fetch(`${API_BASE}/api/questions`);
          if (!res.ok) throw new Error(`Server error ${res.status}`);
          cache.current = (await res.json()) as QuestionsResponse;
        }
        if (!cancelled) {
          setState({
            questions: cache.current.questions,
            databases: cache.current.filters.databases,
            topics: cache.current.filters.topics,
            total: cache.current.count,
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
