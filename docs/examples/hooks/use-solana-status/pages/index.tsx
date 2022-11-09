import { useSolanaStatus } from '@lndgalante/solutils';

export default function Home() {
  // solutils hooks
  const { result, status, error } = useSolanaStatus();

  return (
    <div>
      <main>
        {result === true ? <p>All systems are operational</p> : null}
        {result === false ? <p>Blockchain is having some issues</p> : null}
        {status === 'loading' ? <p>Requesting blockchain status</p> : null}
        {status === 'error' ? <p>{error}</p> : null}
      </main>
    </div>
  );
}
