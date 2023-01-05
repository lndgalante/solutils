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
  const AMOUNT_TO_SEND = 1;
  const ADDRESS_TO_SEND = 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1';
  const TOKEN_MINT_ADDRESS = 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So';

  // handlers
  function handleTransferToTokenMintAddress() {
    getTransferTokensReceipt(ADDRESS_TO_SEND, TOKEN_MINT_ADDRESS, AMOUNT_TO_SEND);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleTransferToTokenMintAddress}>Send {AMOUNT_TO_SEND} SBR tokens</button>
        {status === 'iddle' ? <p>Haven&apos;t sent any SBR yet</p> : null}
        {status === 'loading' ? <p>Sending your SBR tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>We successfully sent: {AMOUNT_TO_SEND} SBR</p>
            <p>Transaction signature: {result.transactionSignature}</p>
            <a href={result?.urls?.solanaExplorerUrl} target='_blank' rel='noreferrer'>
              Solana Explorer
            </a>
          </div>
        ) : null}
        {status === 'error' ? <p>{error}</p> : null}
      </main>
    </div>
  );
}
