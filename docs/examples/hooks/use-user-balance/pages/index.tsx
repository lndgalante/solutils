import { useUserBalance } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // solutils hooks
  const { getUserBalance, result, status } = useUserBalance(publicKey, connection);

  // handlers
  function handleUserBalanceRequest() {
    getUserBalance();
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleUserBalanceRequest}>Request user balance</button>
        {status === 'iddle' ? <p>Haven&apos;t requested any SOL balance yet</p> : null}
        {status === 'loading' ? <p>Requesting your SOL balance tokens</p> : null}
        {status === 'success' ? <p>We successfully got your balance: {result} SOL</p> : null}
        {status === 'error' ? <p>Oops, something wrong happened</p> : null}
      </main>
    </div>
  );
}
