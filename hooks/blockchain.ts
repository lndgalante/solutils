import { useState, useEffect } from 'react';

// common
import { ErrorState, StatusState } from '../common';

// core
import { getSolanaStatus } from '../core';

// types
type ResultState = boolean | null;

export function useSolanaStatus(
  withRefetchInterval: boolean = true,
  refetchInterval: number = 30000,
): {
  result: ResultState;
  status: StatusState;
  error: ErrorState;
} {
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ResultState>(null);

  useEffect(() => {
    async function fetchSolanaStatus() {
      try {
        setStatus('loading');

        const { isHealthy } = await getSolanaStatus();

        setStatus('success');
        setResult(isHealthy);
      } catch (error) {
        setError((error as Error).message);
        setStatus('error');
      }
    }

    if (withRefetchInterval) {
      fetchSolanaStatus();
      const interval = setInterval(fetchSolanaStatus, refetchInterval);

      return () => clearInterval(interval);
    } else {
      fetchSolanaStatus();
    }
  }, []);

  return { result, status, error };
}
