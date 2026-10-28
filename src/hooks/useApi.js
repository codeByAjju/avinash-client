import { useState, useEffect, useCallback } from 'react';
import { api, apiMessage } from '../services/api';
const cache = new Map();
export function clearApiCache() {
  cache.clear();
}
export default function useApi(path) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ data: [], meta: {}, loading: true, error: '' });
  useEffect(() => {
    let active = true;
    const cached = cache.get(path);
    if (cached?.value && Date.now() - cached.time < 60000) {
      setState({ ...cached.value, loading: false, error: '' });
      return;
    }
    setState({ data: [], meta: {}, loading: true, error: '' });
    const pending =
      cached?.promise ||
      api
        .get(path)
        .then((response) => {
          if (!response.data.success || !Array.isArray(response.data.data))
            throw new Error('Invalid API response');
          const value = { data: response.data.data, meta: response.data.meta || {} };
          cache.set(path, { value, time: Date.now() });
          return value;
        })
        .catch((error) => {
          cache.delete(path);
          throw error;
        });
    if (!cached?.promise) cache.set(path, { promise: pending });
    pending
      .then((value) => {
        if (active) setState({ ...value, loading: false, error: '' });
      })
      .catch((error) => {
        if (active) setState({ data: [], meta: {}, loading: false, error: apiMessage(error) });
      });
    return () => {
      active = false;
    };
  }, [path, revision]);
  const retry = useCallback(() => {
    cache.delete(path);
    setRevision((value) => value + 1);
  }, [path]);
  return { ...state, retry };
}
