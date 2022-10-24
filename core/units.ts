import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// common
import { toFixed } from '../common';

export function getLamportsToSol(lamports: number, digitsToDisplay?: number): { sol: number } {
  const sol = lamports / LAMPORTS_PER_SOL;

  if (digitsToDisplay) {
    return { sol: toFixed(sol, digitsToDisplay) };
  }

  return { sol };
}

export function getSolToLamports(sol: number): { lamports: number } {
  const lamports = sol * LAMPORTS_PER_SOL;
  return { lamports };
}
