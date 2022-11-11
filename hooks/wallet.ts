import { useState } from 'react';
import invariant from 'tiny-invariant';
import { PublicKey, Connection } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

// common
import { ErrorState, StatusState } from '../common';

// core
import { getLamportsToSol } from '../core';

type UserBalanceResultState = number;

export function useWalletTokenBalance(publicKey: PublicKey | null, connection: Connection) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<UserBalanceResultState>(0);

  // helpers
  async function getWalletTokenBalance(tokenSymbol: 'SOL'): Promise<number | null> {
    try {
      invariant(publicKey, () => new WalletNotConnectedError()?.message);
      setStatus('loading');

      invariant(tokenSymbol === 'SOL', () => 'Only SOL is supported');

      const lamports = await connection.getBalance(publicKey as PublicKey);
      const { sol } = getLamportsToSol(lamports);

      setResult(sol);
      setStatus('success');

      return sol;
    } catch (error) {
      setError((error as Error).message);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getWalletTokenBalance };
}
