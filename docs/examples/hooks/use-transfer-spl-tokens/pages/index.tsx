import { useTransferSplTokens } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // solutils hooks
  const { getTransferSplTokensReceipt, result, status } = useTransferSplTokens(publicKey, connection, sendTransaction);

  // constants
  const USDC_AMOUNT = 1;
  const RECIPIENT_ADDRESS = '5NSJUuR9Pn1yiFYGPWonqrVh72xxX8D2yADKrUf1USRc';

  // handlers
  function handleSplTransfer() {
    getTransferSplTokensReceipt(RECIPIENT_ADDRESS, 'USDC', USDC_AMOUNT);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleSplTransfer}>Send {USDC_AMOUNT} USDC tokens</button>
        {status === 'iddle' ? <p>Haven&apos;t sent any USDC yet</p> : null}
        {status === 'loading' ? <p>Sending your USDC tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>We successfully sent: {USDC_AMOUNT} USDC</p>
            <p>Transaction signature: {result.transactionSignature}</p>
            <a href={result.urls.solanaExplorerUrl} target='_blank' rel='noreferrer'>
              Solana Explorer
            </a>
          </div>
        ) : null}
        {status === 'error' ? <p>Oops, something wrong happened</p> : null}
      </main>
    </div>
  );
}
