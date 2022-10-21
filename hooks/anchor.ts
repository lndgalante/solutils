import { useMemo } from 'react';
import { Keypair } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Wallet } from '@project-serum/anchor';

export function useAnchorProvider(keypair?: Keypair): { provider: AnchorProvider } {
  // solana hooks
  const { connection } = useConnection();

  // react hooks
  const wallet = useMemo(() => {
    if (keypair) {
      const wallet = new Wallet(keypair);
      return wallet;
    }

    const throwawayKeypair = new Keypair();
    const throwawayWallet = new Wallet(throwawayKeypair);

    return throwawayWallet;
  }, []);

  const provider = useMemo(() => new AnchorProvider(connection, wallet, {}), []);

  return { provider };
}
