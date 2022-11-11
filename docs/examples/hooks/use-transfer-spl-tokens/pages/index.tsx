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
  const USDC_AMOUNT = 1;
  const TOKEN_TO_SEND = 'USDC';
  const RECIPIENT_ADDRESS = '5NSJUuR9Pn1yiFYGPWonqrVh72xxX8D2yADKrUf1USRc';

  // handlers
  function handleSplTransfer() {
    getTransferTokensReceipt(RECIPIENT_ADDRESS, TOKEN_TO_SEND, USDC_AMOUNT);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleSplTransfer}>
          Send {USDC_AMOUNT} {TOKEN_TO_SEND} tokens
        </button>
        {status === 'iddle' ? <p>Haven&apos;t sent any {TOKEN_TO_SEND} yet</p> : null}
        {status === 'loading' ? <p>Sending your {TOKEN_TO_SEND} tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>
              We successfully sent: {USDC_AMOUNT} {TOKEN_TO_SEND}
            </p>
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
