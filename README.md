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

---

> This library is still a WIP, so community help and feedback is more than welcome.

### Installation

⚠️ At the moment the package is scoped, but scope will be removed soon.

NPM

```
npm install @lndgalante/solutils @solana/web3.js @solana/wallet-adapter-react
```

Yarn

```
yarn add @lndgalante/solutils @solana/web3.js @solana/spl-token @solana/wallet-adapter-react
```

PNPM

```
pnpm add @lndgalante/solutils @solana/web3.js @solana/spl-token @solana/wallet-adapter-react
```

### Summary

- [Cluster](#Cluster)
  <details>
    <summary>Methods</summary>

  - [getNewConnection()](#getNewConnection)
  - [getClusterName()](#getClusterName)
  - [getClusterNameFromEndpoint()](#getClusterNameFromEndpoint)

  </details>

* [Keypairs](#Keypairs)
  <details>
    <summary>Methods</summary>

  - [getNewKeypair()](#getNewKeypair)
  - [getKeypairFromFile()](#getKeypairFromFile)
  - [getKeypairFromSecretKey()](#getKeypairFromSecretKey)
  - [getAddressFromPublicKey()](#getAddressFromPublicKey)
  - [getPublicKeyFromAddress()](#getPublicKeyFromAddress)
  - [getIsValidPublicKey()](#getIsValidPublicKey)
  - [getShortAddress()](#getShortAddress)

  </details>

- [Units](#Units)
  <details>
    <summary>Methods</summary>

  - [getLamportsToSol()](#getLamportsToSol)
  - [getSolToLamports()](#getSolToLamports)

  </details>

* [URLs](#URLs)
  <details>
    <summary>Methods</summary>

  - [getRpcEndpointUrl()](#getRpcEndpointUrl)
  - [getExplorerUrl()](#getExplorerUrl)
  - [getAllExplorersUrl()](#getAllExplorersUrl)

  </details>

- [Serialization](#Serialization)
  <details>
    <summary>Methods</summary>

  - [getEncodedBufferFromData()](#getEncodedBufferFromData)
  - [getDecodedDataFromBufferAndSchema()](#getDecodedDataFromBufferAndSchema)
  - [getEmptyBuffer()][#getemptybuffer]

  </details>

* [Transactions](#Transactions)
  <details>
    <summary>Methods</summary>

  - [getTransactionDetails()](#getTransactionDetails)
  - [getIsValidTransaction()](#getIsValidTransaction)

  </details>
  <details>
    <summary>Hooks</summary>

  - [useTransactionDetails()](#useTransactionDetails)
  - [useIsValidTransaction()](#useIsValidTransaction)

  </details>

- [IDLs](#IDLs)
  <details>
    <summary>Methods</summary>

  - [getIdlFromAddress()](#getIdlFromAddress)
  - [getInstructionFromIdl()](#getInstructionFromIdl)

  </details>
  <details>
    <summary>Hooks</summary>

  - [useRequestIdlFromAddress()](#useRequestIdlFromAddress)

  </details>

* [PDAs](#PDAs)
  <details>
    <summary>Methods</summary>

  - [getPdaFromSeedAndProgramAddress()](#getPdaFromSeedAndProgramAddress)

  </details>
  <details>
    <summary>Hooks</summary>

  - [usePdaFromUserPublicKeyAndProgramAddress()](#usePdaFromUserPublicKeyAndProgramAddress)

  </details>

- [Blockchain](#Blockchain)
  <details>
    <summary>Methods</summary>

  - [getSolanaStatus()](#getSolanaStatus)

  </details>
  <details>
    <summary>Hooks</summary>

  - [useSolanaStatus()](#useSolanaStatus)

  </details>

* [Tokens](#Tokens)
  <details>
    <summary>Hooks</summary>

  - [useUserBalance()](#useUserBalance)
  - [useRequestSolAirdrop()](#useRequestSolAirdrop)
  - [useTransferSolTokens()](#useTransferSolTokens)

  </details>

> Solana Pay and NFT helpers coming soon!

---

#### Cluster

##### getNewConnection()

Establishes a JSON RPC connection from a provided endpoint and returns a [Connection](https://docs.solana.com/developing/clients/javascript-reference#connection) object.

> ⚠️ WARNING: You shouldn't use this method if you're using [@solana/wallet-adapter-react](https://github.com/solana-labs/wallet-adapter) since you have this method in a hook form.

_Example_

```typescript
import { getRpcEndpointUrl, getNewConnection } from '@lndgalante/solutils';

const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'mainnet');
const { connection } = getNewConnection(rpcEndpointUrl);

// Then trigger any API method from connection
connection.getSlot().then((slot) => console.log(slot));
```

[CodeSandbox](https://codeSandbox.io/s/solutils-usesolanastatus-vj8uy9?file=/src/App.js)

##### getClusterName()

Returns a parsed name from your cluster name.

_Example_

```typescript
import { getClusterName } from '@lndgalante/solutils';

const { clusterName } = getClusterName('mainnet-beta');

console.log(clusterName); // "Mainnet"
```

##### getClusterNameFromEndpoint()

Returns the cluster name from any endpoint. This is especially useful when you want to know which cluster the user is on when they are using a custom endpoint.

_Example_

```typescript
import { getClusterNameFromEndpoint } from '@lndgalante/solutils';

const { clusterName } = await getClusterNameFromEndpoint('https://solana-api.projectserum.com');

console.log(clusterName); // "mainnet-beta"
```

---

#### Keypairs

##### getNewKeypair()

Returns a new account keypair that could be used for testing purposes like signing transactions.

_Example_

```typescript
import { getNewKeypair } from '@lndgalante/solutils';

const { keypair } = getNewKeypair();
```

##### getKeypairFromFile()

Returns a keypair by reading a secret key from a filepath, if no path is specified it will use the default Solana path which is `~/.config/solana/id.json`.

> ⚠️ WARNING: This method only works on a Node.js environment.

_Example_

```typescript
import { getNewKeypair } from '@lndgalante/solutils';

const { keypair } = getKeypairFromFile();
```

##### getKeypairFromSecretKey()

Returns an account keypair from a secret key, needed when you have a secret key but not the public key related.

_Example_

```typescript
import { getKeypairFromSecretKey, getAddressFromPublicKey } from '@lndgalante/solutils';

const secretKey = [
  134, 98, 243, 255, 26, 77, 24, 179, 246, 4, 71, 250, 137, 117, 154, 223, 245, 56, 40, 129, 83, 9, 251, 155, 79, 73,
  35, 81, 189, 161, 49, 212, 155, 197, 139, 80, 211, 197, 3, 178, 85, 182, 49, 34, 74, 63, 90, 80, 117, 115, 67, 185,
  246, 42, 73, 93, 91, 12, 189, 113, 33, 171, 182, 60,
];

const { keypair } = getKeypairFromSecretKey(secretKey);
const { address } = getAddressFromPublicKey(keypair.publicKey);

console.log(address); // BV4uLAAaPtQSZRYrvwvFzn2fJJkinLQJb73mnhgPYfDM
```

##### getAddressFromPublicKey()

Returns an account address from a public key object.

_Example_

```typescript
import { getNewKeypair, getAddressFromPublicKey } from '@lndgalante/solutils';

const { keypair } = getNewKeypair();
const { address } = getAddressFromPublicKey(keypair.publicKey);

console.log(address); // G9KwiPLZyC52zrSsHnbf9FPnuHu77CDAeGoVkSa1wS8R
```

##### getPublicKeyFromAddress()

Returns an account public key from an address string.

_Example_

```typescript
import { getPublicKeyFromAddres } from '@lndgalante/solutils';

const address = 'G9KwiPLZyC52zrSsHnbf9FPnuHu77CDAeGoVkSa1wS8R';
const { publicKey } = getPublicKeyFromAddres(address);
```

##### getIsValidPublicKey()

Validates if a public key is correct or not.

_Example_

```typescript
import { getNewKeypair, getIsValidPublicKey } from '@lndgalante/solutils';

const { keypair } = getNewKeypair();
const { isValid } = getIsValidPublicKey(keypair.publicKey);

console.log(isValid); // true
```

##### getShortAddress()

Returns a shorter string from your address.

_Example_

```typescript
import { getShortAddress } from '@lndgalante/solutils';

const address = 'BV4uLAAaPtQSZRYrvwvFzn2fJJkinLQJb73mnhgPYfDM';
const { shortAddress } = getShortAddress(address);

console.log(shortAddress); // "BV4u...YfDM"
```

---

#### Units

##### getLamportsToSol()

Converts lamports units to SOL units. You can send a second argument to define amount of digits to truncate without rounding (Optional).

_Example_

```typescript
import { getLamportsToSol } from '@lndgalante/solutils';

const { sol } = getLamportsToSol(3005000000);

console.log(sol); // 3.005
```

```typescript
import { getLamportsToSol } from '@lndgalante/solutils';

const { sol } = getLamportsToSol(3345400000, 2);

console.log(sol); // 3.34
```

##### getSolToLamports()

Converts SOL units to lamports units.

_Example_

```typescript
import { getSolToLamports } from '@lndgalante/solutils';

const { lamports } = getSolToLamports(2.5);

console.log(lamports); // 2500000000
```

---

#### URLs

##### getRpcEndpointUrl()

Returns an RPC endpoint by defining a provider and a cluster type.

Current supported RPC providers are: [Solana](https://solana.com/rpc), [Project Serum](https://github.com/project-serum/awesome-serum#rpc-servers), [GenesysGo](https://shdw.genesysgo.com/genesysgo/the-genesysgo-rpc-network), [AllThatNode](https://www.allthatnode.com/solana.dsrv), [Blockdaemon](https://try.blockdaemon.com/rpc/solana), [Ankr](https://www.ankr.com/rpc/solana), [GetBlock](https://getblock.io/nodes/sol), and [Alchemy](https://www.alchemy.com/solana). Being Alchemy the only one that needs an API key that should be sent as a third parameter.

> ⚠️ WARNING: For production builds you probably want to get a paid RPC service due to service limitations.

_Example_

```typescript
import { getRpcEndpointUrl } from '@lndgalante/solutils';

const { rpcEndpointUrl: solanaMainnetRpc } = getRpcEndpointUrl('solana', 'mainnet');
console.log(solanaMainnetRpc); // "https://api.mainnet-beta.solana.com"

const { rpcEndpointUrl: genesysGoRpc } = getRpcEndpointUrl('genesysgo', 'devnet');
console.log(genesysGoRpc); // "https://devnet.genesysgo.net"

const ALCHEMY_API_KEY = '3EUkBvPfNdHg3qsazLs1zqUVUQfz3ipRXM';
const { rpcEndpointUrl: alchemyRpc } = getRpcEndpointUrl('alchemy', 'mainnet', ALCHEMY_API_KEY);
console.log(alchemyRpc); // "https://solana-mainnet.g.alchemy.com/v2/3EUkBvPfNdHg3qsazLs1zqUVUQfz3ipRXM"
```

##### getExplorerUrl()

Returns a Solana explorer URL which type can be [Solana Explorer](https://explorer.solana.com), [Solscan](https://solscan.io), [SolanaFM](https://solana.fm), or [Solana Beach](https://solanabeach.io), with a transaction signature, block or address.
It automatically switches between a transaction, block, or address URL parameter based on its length.
By default uses Mainnet cluster, but optionally takes a cluster as third parameter.

_Example_

```typescript
import { getExplorerUrl } from '@lndgalante/solutils';

const transactionSignature = '55oJv5oCaez344JawHL5gnwqwrbrN4oD5ZN8rQFvyRSWzwXTTe178QG7KK9cR2wFkwecEca3V5vdbFexFG1ayECm';
const { url: solanaExplorerUrl } = getExplorerUrl('solana-explorer', transactionSignature);
const { url: solscanUrl } = getExplorerUrl('solscan', transactionSignature);

console.log(solanaExplorerUrl); // "https://explorer.solana.com/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"

console.log(solscanUrl); // "https://solscan.io/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"
```

##### getAllExplorersUrl()

Returns all explorer URLs from [Solana Explorer](https://explorer.solana.com), [Solscan](https://solscan.io), [SolanaFM](https://solana.fm), and [Solana Beach](https://solanabeach.io).

_Example_

```typescript
import { getAllExplorersUrl } from '@lndgalante/solutils';

const transactionSignature = '55oJv5oCaez344JawHL5gnwqwrbrN4oD5ZN8rQFvyRSWzwXTTe178QG7KK9cR2wFkwecEca3V5vdbFexFG1ayECm';
const { urls } = getAllExplorersUrl(transactionSignature);

console.log(urls.solanaExplorerUrl); // "https://explorer.solana.com/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"

console.log(urls.solscanUrl); // "https://solscan.io/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"
```

---

#### Serialization

##### getEncodedBufferFromData()

Returns a serialized buffer from a data array, to be used afterwards in your instructions.

> ⚠️ WARNING: Data sent to getEncodedBufferFromData should be in the correct order that the program receives it.

_Example_

```typescript
import { Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { getRpcEndpointUrl, getNewConnection, getEncodedBufferFromData, getExplorerUrl } from '@lndgalante/solutils';

const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'devnet');
const connection = getNewConnection(rpcEndpointUrl);

const data = [
  { label: 'variant', type: 'u8', value: 2 },
  { label: 'playerId', type: 'u16', value: 1435 },
  { label: 'itemId', type: 'u128', value: 737498 },
] as DataItem[];

const { instructionBuffer } = getEncodedBufferFromData(data);

const transaction = new Transaction();
const instruction = new TransactionInstruction({
  data: instructionBuffer,
  programId: EXAMPLE_PROGRAM_ID,
  keys: [{ pubkey: EXAMPLE_PUBLIC_KEY, isSigner: true, isWritable: false }],
});

transaction.add(instruction);

sendAndConfirmTransaction(connection, transaction, [EXAMPLE_SIGNER]).then((transactionSignature) => {
  const { url } = getExplorerUrl('solana-explorer', transactionSignature, 'devnet');
  console.log(`Transaction submitted: ${url}`);
});
```

##### getDecodedDataFromBufferAndSchema()

Returns a serialized buffer from a data array, to be used afterwards in your instructions.

> ⚠️ WARNING: Data sent to getEncodedBufferFromData should be in the correct order that the program receives it.

_Example_

```typescript
import { getDecodedDataFromBufferAndSchema, getEncodedBufferFromData } from '@lndgalante/solutils';

// required initial schema
const schema = [
  { label: 'intialized', type: 'bool' },
  { label: 'playerId', type: 'u16' },
  { label: 'name', type: 'str' },
] as SchemaItem[];

// let's create a fake buffer, we probably get it from a PDA and will not be created by us
const bufferDataInput = [
  { label: 'initialized', type: 'bool', value: true },
  { label: 'playerId', type: 'u16', value: 1435 },
  { label: 'name', type: 'str', value: 'John Doe' },
] as DataItem[];
const { instructionBuffer } = getEncodedBufferFromData(bufferDataInput);

// get decodad data
const data = getDecodedDataFromBufferAndSchema(schema, instructionBuffer);
```

##### getEmptyBuffer()

Returns an empty buffer, needed when no data is mandatory to send to a Program.

_Example_

```typescript
import { getEmptyBuffer } from '@lndgalante/solutils';

const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'devnet');
const { connection } = getNewConnection(rpcEndpointUrl);

const { instructionBuffer } = getEmptyBuffer(data);

const transaction = new Transaction();
const instruction = new TransactionInstruction({
  data: instructionBuffer,
  programId: EXAMPLE_PROGRAM_ID,
  keys: [{ pubkey: EXAMPLE_PUBLIC_KEY, isSigner: true, isWritable: false }],
});

transaction.add(instruction);

sendAndConfirmTransaction(connection, transaction, [EXAMPLE_SIGNER]).then((transactionSignature) => {
  const { url } = getExplorerUrl('solana-explorer', transactionSignature, 'devnet');
  console.log(`Transaction submitted: ${url}`);
});
```

---

#### Transactions

##### getTransactionDetails()

Returns all details related to a transaction by sending its signature.

_Example_

```typescript
import { getTransactionDetails } from '@lndgalante/solutils';

const transactionSignature = '8ykRq1XtgrtymXVkVhsWjaDrid5FkKzRPJrarzJX9a6EArbEUYMrst6vVC6TydDRG4sagSciK6pP5Lw9ZDnt3RD';

const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'mainnet');
const { connection } = getNewConnection(rpcEndpointUrl);

const { transactionDetails } = await getTransactionDetails(connection, transactionSignature);

console.log(transactionDetails);
```

##### getIsValidTransaction()

Returns all details related to a transaction by sending its signature.

_Example_

```typescript
import { getTransactionDetails } from '@lndgalante/solutils';

const transactionSignature = '8ykRq1XtgrtymXVkVhsWjaDrid5FkKzRPJrarzJX9a6EArbEUYMrst6vVC6TydDRG4sagSciK6pP5Lw9ZDnt3RD';

const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'mainnet');
const { connection } = getNewConnection(rpcEndpointUrl);

const { isValidTransaction } = await getIsValidTransaction(transactionSignature, connection);

console.log(isValidTransaction); // true
```

##### useTransactionDetails()

Receives a transaction signature and return all its details, accepts an `autoTrigger` which defaults to `true` to automatically get transaction details. Also returns a `getTransactionDetails` method if you need to trigger the method through the UI.

_Example_

```tsx
import { useTransactionDetails } from '@lndgalante/solutils';

function DemoComponent() {
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
      {status === 'loading' ? <p>Requesting your transaction details</p> : null}
      {status === 'success' && result ? <p>{result.transactionDetails.meta}</p> : null}
      {status === 'error' ? <p>{error}</p> : null}
    </main>
  );
}
```

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-transaction-details)

##### useIsValidTransaction()

Checks if transaction is valid or not by receiving it's signature, accepts an `autoTrigger` which defaults to `true` to automatically get transaction validity.

_Example_

```tsx
import { useIsValidTransaction } from '@lndgalante/solutils';

function DemoComponent() {
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
```

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-is-valid-transaction)

---

#### IDLs

##### getIdlFromAddress()

Returns IDL from a specific address. Optionally, you can use a different cluster as a second parameter, which by default will be `'mainnet-beta'`.
You can use this method in a hook form [useRequestIdlFromAddress()](#####useRequestIdlFromAddress>).

_Example_

```typescript
import { getRpcEndpointUrl, getNewConnection, getIdlFromAddress } from '@lndgalante/solutils';

async function example() {
  const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'mainnet');
  const { connection } = getNewConnection(rpcEndpointUrl);

  const address = 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ';
  const { idl } = await getIdlFromAddress(connection, address);

  console.log(idl); // { version: '4.4.0', name: 'candy_machine', ... }
}

example();
```

##### getInstructionFromIdl()

Returns IDL instruction data (account and arguments) given its name.

_Example_

```typescript
import { getIdlFromAddress, getInstructionFromIdl } from '@lndgalante/solutils';

async function example() {
  const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'mainnet');
  const { connection } = getNewConnection(rpcEndpointUrl);

  const address = 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ';

  const { idl } = await getIdlFromAddress(connection, address);
  const { method } = await getInstructionFromIdl(idl, 'updateCandyMachine');

  console.log(method);

  /*
  {
    name: 'updateCandyMachine',
    accounts: [
      { name: 'candyMachine', isMut: true, isSigner: false },
      { name: 'authority', isMut: false, isSigner: true },
      { name: 'wallet', isMut: false, isSigner: false }
    ],
    args: [ { name: 'data', type: [ { name: 'data', type: { defined: 'CandyMachineData' } } ] } ]
  }
*/
}

example();
```

##### useRequestIdlFromAddress()

Returns an IDL from a particular address.

_Example_

```tsx
import { useRequestIdlFromAddress } from '@lndgalante/solutils';

function DemoComponent() {
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
```

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-request-idl-from-address)

---

#### PDAs

##### getPdaFromSeedAndProgramAddress()

Returns PDAs public key and address from a string seed and a program address.

_Example_

```typescript
import { getPdaFromSeedAndProgramAddress } from '@lndgalante/solutils';

async function example() {
  const SEED = 'SOME_RANDOM_SEED';
  const PROGRAM_ADDRESS = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN';

  const { pdaPublicKey, pdaAddress, bump } = await getPdaFromSeedAndProgramAddress(SEED, PROGRAM_ADDRESS);
}

example();
```

##### usePdaFromUserPublicKeyAndProgramAddress()

Use it to get PDA public key and address using public key from user connected wallet and a program address. Optionally `getPdaFromUserPublicKeyAndProgramAddress` accepts a second argument with a seeds string array.

_Example_

```tsx
import { usePdaFromUserPublicKeyAndProgramAddress } from '@lndgalante/solutils';

function DemoComponent() {
  // solutils hooks
  const { result, status, error, getPdaFromUserPublicKeyAndProgramAddress } =
    usePdaFromUserPublicKeyAndProgramAddress();

  // constants
  const PROGRAM_ADDRESS = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN';
  const EXTRA_SEEDS = ['part-a', 'part-b'];

  // handlers
  function handleRequestPDA() {
    getPdaFromUserPublicKeyAndProgramAddress(PROGRAM_ADDRESS, EXTRA_SEEDS);
  }

  return (
    <div>
      <button onClick={handleRequestPDA}>Request PDA</button>
      {status === 'iddle' ? <p>Haven&apos;t requested any PDA yet</p> : null}
      {status === 'loading' ? <p>Requesting PDA...</p> : null}
      {status === 'success' ? <p>We successfully got PDA address: {result.pdaAddress}</p> : null}
      {status === 'error' ? <p>{error}</p> : null}
    </div>
  );
}
```

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-pda-from-user-public-key-and-program-address)

---

#### Blockchain

##### getSolanaStatus()

Returns an `isHealthy` boolean to know blockchain current status.

_Example_

```typescript
import { getSolanaStatus } from '@lndgalante/solutils';

async function example() {
  const { isHealthy } = await getSolanaStatus();

  console.log(isHealthy); // true
}

example();
```

##### useSolanaStatus()

Same as previous method but by default re-fetchs Solana status every 30 seconds. Optionally, refetching can be disabled using a `false` flag as a first parameter, and refetch interval could be also modified in ms as a second parameter.

_Example_

```tsx
import { useSolanaStatus } from '@lndgalante/solutils';

function DemoComponent() {
  // solutils hooks
  const { result, status, error } = useSolanaStatus();

  return (
    <div>
      {result === true ? <p>All systems are operational</p> : null}
      {result === false ? <p>Blockchain is having some issues</p> : null}
      {status === 'loading' ? <p>Requesting blockchain status</p> : null}
      {status === 'error' ? <p>{error}</p> : null}
    </div>
  );
}
```

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-solana-status)

---

#### Tokens

##### useUserBalance()

Returns user current balance in SOL.

_Example_

```tsx
import { useUserBalance } from '@lndgalante/solutils';

export default function Home() {
  // solana hooks
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // solutils hooks
  const { result, status, getUserBalance } = useUserBalance(publicKey, connection);

  // handlers
  function handleUserBalanceRequest() {
    getUserBalance();
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleUserBalanceRequest}>Request user balance</button>
        {status === 'iddle' ? <p>Haven&apos;t requested any SOL balance yet</p> : null}
        {status === 'loading' ? <p>Requesting your SOL balance tokens</p> : null}
        {status === 'success' && result ? <p>We successfully got your balance: {result} SOL</p> : null}
        {status === 'error' ? <p>{error}</p> : null}
      </main>
    </div>
  );
}
```

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-user-balance)

##### useRequestSolAirdrop()

Returns a function to request SOL airdrop for the connected wallet and a status variable to track transaction state.

_Example_

```tsx
import { useRequestSolAirdrop } from '@lndgalante/solutils';

export default function Home() {
  // solana hooks
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // solutils hooks
  const { result, status, error, getSolAirdrop } = useRequestSolAirdrop(publicKey, connection);

  // constants
  const SOL = 2;

  // handlers
  function handleSolRequest() {
    getSolAirdrop(SOL);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleSolRequest}>Request Airdrop</button>
        {status === 'iddle' ? <p>Haven&apos;t requested any SOL yet</p> : null}
        {status === 'loading' ? <p>Airdropping your SOL tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>Your {SOL} tokens have arrived, check your wallet!</p>
            <p>Transaction signature: {result.transactionSignature}</p>
            <a href={result.urls.solscanUrl} target='_blank' rel='noreferrer'>
              Solscan
            </a>
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

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-request-sol-airdrop)

##### useTransferSolTokens()

Use this hook to transfer SOL tokens from the connected wallet to a specific address.

_Example_

```tsx
import { useTransferSolTokens } from '@lndgalante/solutils';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  // solana hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // solutils hooks
  const { result, status, error, getTransferSolTokensReceipt } = useTransferSolTokens(
    publicKey,
    connection,
    sendTransaction,
  );

  // constants
  const SOL_TO_SEND = 0.001;
  const ADDRESS_TO_SEND = '5NSJUuR9Pn1yiFYGPWonqrVh72xxX8D2yADKrUf1USRc';

  // handlers
  function handleUserBalanceRequest() {
    getTransferSolTokensReceipt(SOL_TO_SEND, ADDRESS_TO_SEND);
  }

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />

      <main>
        <button onClick={handleUserBalanceRequest}>Send {SOL_TO_SEND} SOL tokens</button>
        {status === 'iddle' ? <p>Haven&apos;t sent any SOL yet</p> : null}
        {status === 'loading' ? <p>Sending your SOL tokens</p> : null}
        {status === 'success' && result ? (
          <div>
            <p>We successfully sent: {SOL_TO_SEND} SOL</p>
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

[Repo Example](https://github.com/lndgalante/solutils/tree/main/docs/examples/hooks/use-transfer-sol-tokens)

---

### Authors

Thanks to Alejandro [@afreitezzz](https://twitter.com/afreitezzz) for creating the logo!
