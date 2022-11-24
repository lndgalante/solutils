<p align="center">
   <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lndgalante/solutils/main/docs/solutils-light.svg">
    <img alt="solutils logo" src="https://raw.githubusercontent.com/lndgalante/solutils/main/docs/solutils-dark.svg" width="auto" height="90">
  </picture>
</p>

<p align="center">
  React Hooks and Helpers for Solana
<p>

<div align="center">
  <a href="https://www.npmjs.com/package/@lndgalante/solutils">
    <img src="https://img.shields.io/npm/v/@lndgalante/solutils?colorA=21262d&colorB=161b22&style=flat" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@lndgalante/solutils">
    <img src="https://img.shields.io/npm/dm/@lndgalante/solutils?colorA=21262d&colorB=161b22&style=flat" alt="Downloads per month">
  </a>
</div>

### Documentation

For full documentation and examples, visit [solutils.vercel.app](https://solutils.vercel.app).

### Installation

Install solutils and its @solana peer dependencies.

```bash
npm install @lndgalante/solutils @solana/web3.js @solana/spl-token @solana/wallet-adapter-react
```

### Quick Start

Send USDC tokens in under a minute

```tsx
import { useTransferTokens } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // solutils hooks
  const { getTransferTokensReceipt, result, status, error } = useTransferTokens(publicKey, connection, sendTransaction);

  // handlers
  function handleTransferUsdcTokens() {
    getTransferTokensReceipt('5NSJUuR9Pn1yiFYGPWonqrVh72xxX8D2yADKrUf1USRc', 'USDC', 1);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleTransferUsdcTokens}>Send {AMOUNT_TO_SEND} USDC tokens</button>
        {status === 'iddle' ? <p>Haven&apos;t sent any USDC yet</p> : null}
        {status === 'loading' ? <p>Sending your USDC tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>We successfully sent: {USDC_TO_SEND} USDC</p>
            <p>Transaction signature: {result.transactionSignature}</p>
            <a href={result.urls.solanaExplorerUrl} target='_blank' rel='noreferrer'>
              Solana Explorer
            </a>
          </div>
        ) : null}
        {status === 'error' ? <p>{error}</p> : null}
      </main>
    </div>
  );
}
```

In this example we import `useConnection` and `useWallet` which we usually need for solutils hooks to send wallet `publicKey` and wallet `connection` object.
Particulary here we also need the `sendTransaction` function from `useWallet` to internally send that transaction.

`useTransferTokens` returns many things but the most important thing here is `getTransferTokensReceipt` which takes a address recipient, a token symbol or address, and an amount to send to that address.

`useTransferTokens` also will return `result` object with the result if it the transfer is succesful, a `status` that could be `iddle`, `loading`, `success` or `error`, and finally an `error` which is a string with the error to display on screen.

And that's pretty much it, we render a UI to trigger our `handleTransferUsdcTokens` function, and depending on our `status` states we will display different messages.

Most of the hooks works this way, so learn once and then repeat same pattern with the other hooks.

---

### Security

Concerned about using a third-party library due to sensible code? We're working on making a fully tested, and secure library, but in case you or your company don't want to use this directly feel free to fork it, modify it and send any PR to improve it later on.

---

### Authors

Thanks to Alejandro [@afreitezzz](https://twitter.com/afreitezzz) for creating the logo!
