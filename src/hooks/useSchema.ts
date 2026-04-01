'use client';

import { useState, useEffect, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export interface SchemaColumn {
  name: string;
  type: string;
  key: string;       // 'PRI' | 'MUL' | 'UNI' | ''
  nullable: boolean;
}

export interface SchemaTable {
  name: string;
  estimatedRows: number;
  columns: SchemaColumn[];
}

interface UseSchemaState {
  tables: SchemaTable[];
  loading: boolean;
  error: string | null;
}

const schemaCache = new Map<string, SchemaTable[]>();

export function useSchema(dbName: string) {
  const [state, setState] = useState<UseSchemaState>({
    tables: [],
    loading: false,
    error: null,
  });

  const currentDb = useRef(dbName);
  currentDb.current = dbName;

  useEffect(() => {
    if (!dbName) return;
    let cancelled = false;

    const load = async () => {
      if (schemaCache.has(dbName)) {
        setState({ tables: schemaCache.get(dbName)!, loading: false, error: null });
        return;
      }
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(`${API_BASE}/api/schema/${dbName}`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if (!cancelled && currentDb.current === dbName) {
          schemaCache.set(dbName, data.tables ?? []);
          setState({ tables: data.tables ?? [], loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled && currentDb.current === dbName) {
          setState({
            tables: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load schema',
          });
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [dbName]);

  return state;
}
