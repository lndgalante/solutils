import { useRequestSolAirdrop, useUserBalance } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

export default function Home() {
  // solana hooks
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // solutils hooks
  const { getSolAirdrop, result, status, error } = useRequestSolAirdrop(publicKey, connection);

  // constants
  const SOL = 2;

  // handlers
  function handleSolRequest() {
    getSolAirdrop(SOL);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleSolRequest}>Request Airdrop</button>
        {status === 'iddle' ? <p>Haven&apos;t requested any SOL yet</p> : null}
        {status === 'loading' ? <p>Airdropping your SOL tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>Your {SOL} tokens have arrived, check your wallet!</p>
            <p>Transaction signature: {result.transactionSignature}</p>
            <a href={result.urls.solscanUrl} target='_blank' rel='noreferrer'>
              Solscan
            </a>
            <a href={result.urls.solanaExplorerUrl} target='_blank' rel='noreferrer'>
              Solana Explorer
            </a>
          </div>
        ) : null}
        {status === 'error' ? <p>{error}</p> : null}
      </main>
    </div>
  );
}
