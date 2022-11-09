import { useWalletTokenBalance } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // solutils hooks
  const { getWalletTokenBalance, result, status, error } = useWalletTokenBalance(publicKey, connection);

  // handlers
  function handleWalletBalanceRequest() {
    getWalletTokenBalance('SOL');
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleWalletBalanceRequest}>Request wallet balance</button>
        {status === 'iddle' ? <p>Haven&apos;t requested any SOL balance yet</p> : null}
        {status === 'loading' ? <p>Requesting your SOL balance tokens</p> : null}
        {status === 'success' ? <p>We successfully got your balance: {result} SOL</p> : null}
        {status === 'error' ? <p>{error}</p> : null}
      </main>
    </div>
  );
}
