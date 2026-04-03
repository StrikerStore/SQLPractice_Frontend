'use client';

import { useState, useCallback } from 'react';
import type { BuildConceptStep } from '../types/question';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface UseBuildConceptState {
  steps: BuildConceptStep[];
  loading: boolean;
  error: string | null;
  revealedCount: number;
}

export function useBuildConcept(questionId: string | null) {
  const [state, setState] = useState<UseBuildConceptState>({
    steps: [],
    loading: false,
    error: null,
    revealedCount: 0,
  });

  const fetch_ = useCallback(async (id: string) => {
    setState({ steps: [], loading: true, error: null, revealedCount: 0 });
    try {
      const res = await fetch(`${API_BASE}/api/questions/${id}/build-concept`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setState({ steps: data.steps ?? [], loading: false, error: null, revealedCount: 1 });
    } catch (err) {
      setState({
        steps: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load build concept',
        revealedCount: 0,
      });
    }
  }, []);

  const load = useCallback(() => {
    if (questionId) fetch_(questionId);
  }, [questionId, fetch_]);

  const revealNext = useCallback(() => {
    setState((s) => ({
      ...s,
      revealedCount: Math.min(s.revealedCount + 1, s.steps.length),
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ steps: [], loading: false, error: null, revealedCount: 0 });
  }, []);

  return { ...state, load, revealNext, reset };
}
