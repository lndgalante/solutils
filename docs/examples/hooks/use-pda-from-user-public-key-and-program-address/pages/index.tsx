import { useWallet } from '@solana/wallet-adapter-react';
import { usePdaFromUserPublicKeyAndProgramAddress } from '@lndgalante/solutils';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { publicKey } = useWallet();

  // solutils hooks
  const { getPdaFromUserPublicKeyAndProgramAddress, result, status, error } =
    usePdaFromUserPublicKeyAndProgramAddress(publicKey);

  // constants
  const PROGRAM_ADDRESS = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN';
  const EXTRA_SEEDS = ['part-a', 'part-b'];

  // handlers
  function handleRequestPDA() {
    getPdaFromUserPublicKeyAndProgramAddress(PROGRAM_ADDRESS, EXTRA_SEEDS);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleRequestPDA}>Request PDA</button>
        {status === 'iddle' ? <p>Haven&apos;t requested any PDA yet</p> : null}
        {status === 'loading' ? <p>Requesting PDA...</p> : null}
        {status === 'success' && result ? <p>We successfully got PDA address: {result.pdaAddress}</p> : null}
        {status === 'error' ? <p>{error}</p> : null}
      </main>
    </div>
  );
}
