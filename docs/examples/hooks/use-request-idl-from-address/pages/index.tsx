import { useConnection } from '@solana/wallet-adapter-react';
import { useRequestIdlFromAddress } from '@lndgalante/solutils';

export default function Home() {
  // solana hooks
  const { connection } = useConnection();

  // solutils hooks
  const { result, status, error, getIdlFromAddress } = useRequestIdlFromAddress(connection);

  // constants
  const address = 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ';

  // handlers
  async function handleIdlRequest() {
    await getIdlFromAddress(address);
  }

  return (
    <main>
      <button onClick={handleIdlRequest}>Request IDL</button>
      {status === 'iddle' ? <p>Haven&apos;t requested any IDL yet</p> : null}
      {status === 'loading' ? <p>Requesting your IDL</p> : null}
      {status === 'success' && result ? (
        <div>
          <h3>IDL name: {result.idl.name}</h3>
          <h3>IDL version: {result.idl.version}</h3>
          <h3>IDL Instructions:</h3>
          <ul>
            {result.idl.instructions.map((instruction) => (
              <li key={instruction.name}>{instruction.name}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {status === 'error' ? <p>{error}</p> : null}
    </main>
  );
}
