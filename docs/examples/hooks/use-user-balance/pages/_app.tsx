import type { AppProps } from 'next/app';
import { getRpcEndpointUrl } from '@lndgalante/solutils';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

// styles
require('@solana/wallet-adapter-react-ui/styles.css');

// rpc endpoint and wallet
const wallets = [new PhantomWalletAdapter()];
const { rpcUrl } = getRpcEndpointUrl('solana', 'devnet');

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider endpoint={rpcUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
