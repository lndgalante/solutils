import { inflate } from 'pako';
import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { decodeIdlAccount, Idl } from '@project-serum/anchor/dist/cjs/idl';

// common
import { ErrorState, StatusState } from '../common';

// core
import { getPublicKeyFromAddress } from '../core';

// types
type ResultState = { idl: Idl } | null;

export function useRequestIdlFromAddress(connection: Connection): {
  result: ResultState;
  status: StatusState;
  error: ErrorState;
  getIdlFromAddress: (address: string) => Promise<ResultState>;
} {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ResultState>(null);

  // helpers
  async function getIdlFromAddress(address: string): Promise<ResultState> {
    try {
      setStatus('loading');

      const { publicKey: programId } = getPublicKeyFromAddress(address);
      const [base] = await PublicKey.findProgramAddress([], programId);

      const idlAddress = await PublicKey.createWithSeed(base, 'anchor:idl', programId);
      const idlAccountInfo = await connection.getAccountInfo(idlAddress);
      if (!idlAccountInfo) return null;

      const idlAccount = decodeIdlAccount(idlAccountInfo.data.slice(8));
      const inflatedIdl = inflate(idlAccount.data);
      const idl: Idl = JSON.parse(utf8.decode(inflatedIdl));

      setResult({ idl });
      setStatus('success');

      return { idl };
    } catch (error) {
      setError((error as Error).message);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getIdlFromAddress };
}
