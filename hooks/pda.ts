import { useState } from 'react';
import invariant from 'tiny-invariant';
import { PublicKey } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

// common
import { ErrorState, StatusState } from '../common';

// core
import { getPublicKeyFromAddress, getAddressFromPublicKey } from '../core';

// types
type ResultState = { pdaPublickKey: PublicKey; pdaAddress: string; bump: number } | null;

export function usePdaFromUserPublicKeyAndProgramAddress(publicKey: PublicKey | null): {
  result: ResultState;
  status: StatusState;
  error: ErrorState;
  getPdaFromUserPublicKeyAndProgramAddress: (
    programAddress: string,
    extraSeeds?: string[],
  ) => Promise<ResultState | null>;
} {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ResultState>(null);

  // helpers
  async function getPdaFromUserPublicKeyAndProgramAddress(
    programAddress: string,
    extraSeeds?: string[],
  ): Promise<ResultState> {
    try {
      invariant(publicKey, () => new WalletNotConnectedError()?.message);
      setStatus('loading');

      const { publicKey: programPublicKey } = getPublicKeyFromAddress(programAddress);
      const extraSeedsBuffer = extraSeeds ? extraSeeds.map((seed) => Buffer.from(seed)) : [];

      const [pdaPublickKey, bump] = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), ...extraSeedsBuffer],
        programPublicKey,
      );

      const { address: pdaAddress } = getAddressFromPublicKey(pdaPublickKey);
      const result = { pdaPublickKey, pdaAddress, bump };

      setStatus('success');
      setResult(result as ResultState);

      return result;
    } catch (error) {
      setError((error as Error).message);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getPdaFromUserPublicKeyAndProgramAddress };
}
