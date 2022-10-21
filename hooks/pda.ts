import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// common
import { ErrorState, StatusState } from '../common/types';

// core
import { getPublicKeyFromAddress, getAddressFromPublicKey } from '../core';

// types
type ResultState = { pdaPublickKey: PublicKey; pdaAddress: string; bump: number } | null;

export function usePdaFromUserPublicKeyAndProgramAddress(): {
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

  // solana hooks
  const { publicKey } = useWallet();

  // helpers
  async function getPdaFromUserPublicKeyAndProgramAddress(
    programAddress: string,
    extraSeeds?: string[],
  ): Promise<ResultState> {
    try {
      setStatus('loading');

      if (!publicKey) {
        setStatus('error');
        return null;
      }

      const { publicKey: programPublicKey } = getPublicKeyFromAddress(programAddress);
      const extraSeedsBuffer = extraSeeds ? extraSeeds.map((seed) => Buffer.from(seed)) : [];

      const [pdaPublickKey, bump] = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), ...extraSeedsBuffer],
        programPublicKey,
      );

      const { address: pdaAddress } = getAddressFromPublicKey(pdaPublickKey);
      const result = { pdaPublickKey, pdaAddress, bump };

      setStatus('success');
      setResult(result);

      return result;
    } catch (error) {
      setError(error);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getPdaFromUserPublicKeyAndProgramAddress };
}
