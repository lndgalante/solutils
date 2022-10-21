import { inflate } from 'pako';
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { decodeIdlAccount, Idl } from '@project-serum/anchor/dist/cjs/idl';

// common
import { ErrorState, StatusState } from '../common/types';

// core
import { getPublicKeyFromAddress } from '../core';

// types
type ResultState = Idl | null;

export function useRequestIdlFromAddress(): {
  result: ResultState;
  status: StatusState;
  error: ErrorState;
  getIdlFromAddress: (address: string) => Promise<{ idl: ResultState }>;
} {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ResultState>(null);

  // solana hooks
  const { connection } = useConnection();

  // helpers
  async function getIdlFromAddress(address: string): Promise<{ idl: ResultState }> {
    try {
      setStatus('loading');

      const { publicKey: programId } = getPublicKeyFromAddress(address);
      const [base] = await PublicKey.findProgramAddress([], programId);

      const idlAddress = await PublicKey.createWithSeed(base, 'anchor:idl', programId);
      const idlAccountInfo = await connection.getAccountInfo(idlAddress);
      if (!idlAccountInfo) return { idl: null };

      const idlAccount = decodeIdlAccount(idlAccountInfo.data.slice(8));
      const inflatedIdl = inflate(idlAccount.data);
      const idl: Idl = JSON.parse(utf8.decode(inflatedIdl));

      setResult(idl);
      setStatus('success');

      return { idl };
    } catch (error) {
      setError(error);
      setStatus('error');
      return { idl: null };
    }
  }

  return { result, status, error, getIdlFromAddress };
}
