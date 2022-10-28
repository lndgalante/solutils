import { useTransactionDetails } from '@lndgalante/solutils';
import { useConnection } from '@solana/wallet-adapter-react';

export default function Home() {
  // constants
  const transactionSignature =
    '5YhPNrHFcR9h2BaNvqahEb7JjY6XFkXyeeVANguFxzSrQHLvVB3ZZVVA7PLsqm7J7Gec94x8UztvVYds7H7U2ZNv';

  // solana hooks
  const { connection } = useConnection();

  // solutils hooks
  const { result, status, error } = useTransactionDetails(connection, transactionSignature);

  return (
    <main>
      <p>Transaction signature {transactionSignature}</p>

      {status === 'iddle' ? <p>Haven&apos;t requested any transaction details yet</p> : null}
      {status === 'loading' ? <p>Requesting your transaction details</p> : null}
      {status === 'success' && result ? <p>{result.transactionDetails.meta}</p> : null}
      {status === 'error' ? <p>{error}</p> : null}
    </main>
  );
}
