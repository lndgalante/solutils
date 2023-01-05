import { useTransferTokens } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // solutils hooks
  const { getTransferTokensReceipt, result, status, error } = useTransferTokens(publicKey, connection, sendTransaction);
  // constants
  const SOL_TO_SEND = 0.001;
  const TOKEN_TO_SEND = 'SOL';
  const ADDRESS_TO_SEND = '5NSJUuR9Pn1yiFYGPWonqrVh72xxX8D2yADKrUf1USRc';

  // handlers
  function handleUserBalanceRequest() {
    getTransferTokensReceipt(ADDRESS_TO_SEND, TOKEN_TO_SEND, SOL_TO_SEND);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleUserBalanceRequest}>Send {SOL_TO_SEND} SOL tokens</button>
        {status === 'iddle' ? <p>Haven&apos;t sent any SOL yet</p> : null}
        {status === 'loading' ? <p>Sending your SOL tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>We successfully sent: {SOL_TO_SEND} SOL</p>
            <p>Transaction signature: {result.transactionSignature}</p>
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
