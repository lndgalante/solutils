import { useTransferSplTokens } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  // solutils hooks
  const { getTransferSplTokensReceipt, result, status, error } = useTransferSplTokens(
    publicKey,
    connection,
    sendTransaction,
    // @ts-expect-error
    signTransaction,
  );
  console.log('\n ~ Home ~ error', error);

  // constants
  const SBR_AMOUNT = 1;
  const RECIPIENT_ADDRESS = '5NSJUuR9Pn1yiFYGPWonqrVh72xxX8D2yADKrUf1USRc';
  const SBR_TOKEN_MINT_ADDRESS = 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1';

  // handlers
  function handleSplTransfer() {
    getTransferSplTokensReceipt(SBR_TOKEN_MINT_ADDRESS, RECIPIENT_ADDRESS, SBR_AMOUNT);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleSplTransfer}>Send {SBR_AMOUNT} SBR tokens</button>
        {status === 'iddle' ? <p>Haven&apos;t sent any SBR yet</p> : null}
        {status === 'loading' ? <p>Sending your SBR tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>We successfully sent: {SBR_AMOUNT} SBR</p>
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
