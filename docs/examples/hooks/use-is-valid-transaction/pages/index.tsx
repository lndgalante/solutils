import { useIsValidTransaction } from '@lndgalante/solutils';
import { useConnection } from '@solana/wallet-adapter-react';

export default function Home() {
  // constants
  const transactionSignature =
    '8ykRq1XtgrtymXVkVhsWjaDrid5FkKzRPJrarzJX9a6EArbEUYMrst6vVC6TydDRG4sagSciK6pP5Lw9ZDnt3RD';

  // solana hooks
  const { connection } = useConnection();

  // solutils hooks
  const { result, status, error } = useIsValidTransaction(connection, transactionSignature);

  return (
    <main>
      <p>Transaction signature {transactionSignature}</p>

      {status === 'iddle' ? <p>Haven&apos;t checked transaction validity</p> : null}
      {status === 'loading' ? <p>Requesting if transaction is valid or not</p> : null}
      {status === 'success' && result ? (
        <p>{result.isValidTransaction ? 'Transaction is a valid' : 'Transaction is not valid'}</p>
      ) : null}
      {status === 'error' ? <p>{error}</p> : null}
    </main>
  );
}
