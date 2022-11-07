import { useState } from 'react';
import { Connection } from '@solana/web3.js';
import { Idl } from '@project-serum/anchor/dist/cjs/idl';

// common
import { ErrorState, StatusState } from '../common';

// core
import { getIdlFromAddress as getIdlFromAddressCore } from '../core';

// types
type ResultState = { idl: Idl } | null;

export function useRequestIdlFromAddress(connection: Connection) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ResultState>(null);

  // helpers
  async function getIdlFromAddresss(address: string): Promise<ResultState> {
    try {
      setStatus('loading');

      const result = await getIdlFromAddressCore(connection, address);

      setResult(result);
      setStatus('success');

      return result;
    } catch (error) {
      setError((error as Error).message);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getIdlFromAddresss };
}
