import { useTransactionDetails } from '@lndgalante/solutils';
import { useConnection } from '@solana/wallet-adapter-react';

export default function Home() {
  // constants
  const transactionSignature =
    '8ykRq1XtgrtymXVkVhsWjaDrid5FkKzRPJrarzJX9a6EArbEUYMrst6vVC6TydDRG4sagSciK6pP5Lw9ZDnt3RD';

  // solana hooks
  const { connection } = useConnection();

  // solutils hooks
  const { result, status, error } = useTransactionDetails(connection, transactionSignature);

  return (
    <main>
      <p>Transaction signature {transactionSignature}</p>

      {status === 'iddle' ? <p>Haven&apos;t requested any transaction details yet</p> : null}
      {status === 'loading' ? <p>Requesting your transaction deytails</p> : null}
      {status === 'success' && result ? (
        <div>
          <p>Block time : {result.transactionDetails.blockTime}</p>
          <p>Slot : {result.transactionDetails.slot}</p>
        </div>
      ) : null}
      {status === 'error' ? <p>{error}</p> : null}
    </main>
  );
}
