<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lndgalante/solutils/main/docs/solutils-light.svg">
    <img alt="solutils logo" src="https://raw.githubusercontent.com/lndgalante/solutils/main/docs/solutils-dark.svg" width="auto" height="90">
  </picture>
</p>

<p align="center">
  React Hooks and Helpers for Solana
<p>

---

> This library is still a WIP, so community help and feedback is more than welcome.

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

  </details>
  <details>
    <summary>Hooks</summary>

  - [useTransactionDetails()](#useTransactionDetails)

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

- [Anchor](#Anchor)
  <details>
    <summary>Hooks</summary>

  - [useAnchorProvider()](#useAnchorProvider)

  </details>

> Solana Pay, and NFT helpers coming soon!

---

#### Cluster

##### getNewConnection()

_Definition_

Establish a JSON RPC connection from a provided endpoint and return a [Connection](https://docs.solana.com/developing/clients/javascript-reference#connection) object.

> ⚠️ WARNING: You shouldn't use this method if you're using [@solana/wallet-adapter-react](https://github.com/solana-labs/wallet-adapter) since you have this method in a hook form.

_Example_

```typescript
import { getRpcEndpointUrl, getNewConnection } from 'solutils';

const { rpcEndpointUrl } = getRpcEndpointUrl('solana', 'mainnet');
const { connection } = getNewConnection(rpcEndpointUrl);

// Then trigger any API method from connection
connection.getSlot().then((slot) => console.log(slot));
```

##### getClusterName()

_Definition_

It returns a parsed name from your cluster name.

_Example_

```typescript
import { getClusterName } from 'solutils';

const { clusterName } = getClusterName('mainnet-beta');

console.log(clusterName); // "Mainnet"
```

##### getClusterNameFromEndpoint()

_Definition_

It returns the cluster name from any endpoint. This is especially useful when you want to know which cluster the user is on when they are using a custom endpoint.

_Example_

```typescript
import { getClusterNameFromEndpoint } from 'solutils';

const { clusterName } = await getClusterNameFromEndpoint('https://solana-api.projectserum.com');

console.log(clusterName); // "mainnet-beta"
```

---

#### Keypairs

##### getNewKeypair()

_Definition_

It returns a new account keypair that could be used for testing purposes like signing transactions.

_Example_

```typescript
import { getNewKeypair } from 'solutils';

const { keypair } = getNewKeypair();
```

##### getKeypairFromFile()

_Definition_

It returns a keypair by reading a secret key from a filepath, if not path is specified it will use defaults Solana path which is `~/.config/solana/id.json`.

> ⚠️ WARNING: This method only works on a Node.js only environment.

_Example_

```typescript
import { getNewKeypair } from 'solutils';

const { keypair } = getKeypairFromFile();
```

##### getKeypairFromSecretKey()

_Definition_

It returns an account keypair from a secret key, needed when you have a secret key but not the public key related.

_Example_

```typescript
import { getKeypairFromSecretKey, getAddressFromPublicKey } from 'solutils';

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

_Definition_

Returns an account address from a public key object.

_Example_

```typescript
import { getNewKeypair, getAddressFromPublicKey } from 'solutils';

const { keypair } = getNewKeypair();
const { address } = getAddressFromPublicKey(keypair.publicKey);

console.log(address); // G9KwiPLZyC52zrSsHnbf9FPnuHu77CDAeGoVkSa1wS8R
```

##### getPublicKeyFromAddress()

_Definition_

Returns an account public key from an address string.

_Example_

```typescript
import { getPublicKeyFromAddres } from 'solutils';

const address = 'G9KwiPLZyC52zrSsHnbf9FPnuHu77CDAeGoVkSa1wS8R';
const { publicKey } = getPublicKeyFromAddres(address);
```

##### getIsValidPublicKey()

_Definition_

Validates if a public key is correct or not.

_Example_

```typescript
import { getNewKeypair, getIsValidPublicKey } from 'solutils';

const { keypair } = getNewKeypair();
const { isValid } = getIsValidPublicKey(keypair.publicKey);

console.log(isValid); // true
```

##### getShortAddress()

_Definition_

Returns a shorter string from your address.

_Example_

```typescript
import { getShortAddress } from 'solutils';

const address = 'BV4uLAAaPtQSZRYrvwvFzn2fJJkinLQJb73mnhgPYfDM';
const { shortAddress } = getShortAddress(address);

console.log(shortAddress); // "BV4u...YfDM"
```

---

#### Units

##### getLamportsToSol()

_Definition_

Converts lamports units to SOL units. Optionally send a second argument to define amount of digits to truncate without rounding.

_Example_

```typescript
import { getLamportsToSol } from 'solutils';

const { sol } = getLamportsToSol(3005000000);

console.log(sol); // 3.005
```

```typescript
import { getLamportsToSol } from 'solutils';

const { sol } = getLamportsToSol(3345400000, 2);

console.log(sol); // 3.34
```

##### getSolToLamports()

_Definition_

Converts lamports units to SOL units.

_Example_

```typescript
import { getSolToLamports } from 'solutils';

const { lamports } = getSolToLamports(2.5);

console.log(lamports); // 2500000000
```

---

#### URLs

##### getRpcEndpointUrl()

_Definition_

Returns a RPC endpoint by defining a provider and a cluster type.

Current supported RPC providers are: [Solana](https://solana.com/rpc), [Project Serum](https://github.com/project-serum/awesome-serum#rpc-servers), [GenesysGo](https://shdw.genesysgo.com/genesysgo/the-genesysgo-rpc-network), [AllThatNode](https://www.allthatnode.com/solana.dsrv), [Blockdaemon](https://try.blockdaemon.com/rpc/solana), [Ankr](https://www.ankr.com/rpc/solana), [GetBlock](https://getblock.io/nodes/sol), and [Alchemy](https://www.alchemy.com/solana). Being Alchemy the only one that needs an API key that will be received as a third parameter.

> ⚠️ WARNING: For production you probably want to get a paid RPC service due to service limitations.

_Example_

```typescript
import { getRpcEndpointUrl } from 'solutils';

const { rpcEndpointUrl: solanaMainnetRpc } = getRpcEndpointUrl('solana', 'mainnet');
console.log(solanaMainnetRpc); // "https://api.mainnet-beta.solana.com"

const { rpcEndpointUrl: genesysGoRpc } = getRpcEndpointUrl('genesysgo', 'devnet');
console.log(genesysGoRpc); // "https://devnet.genesysgo.net"
```

##### getExplorerUrl()

_Definition_

Returns a Solana explorer url explorer type that could be [Solana Explorer](https://explorer.solana.com), [Solscan](https://solscan.io), [SolanaFM](https://solana.fm), or [Solana Beach](https://solanabeach.io), and a transaction siganture, block or address.
It automatically switches between a transaction, block, or address url parameter based on its length.
By default uses Mainnet cluster, but optionally takes a cluster as third parameter.

_Example_

```typescript
import { getExplorerUrl } from 'solutils';

const transactionSignature = '55oJv5oCaez344JawHL5gnwqwrbrN4oD5ZN8rQFvyRSWzwXTTe178QG7KK9cR2wFkwecEca3V5vdbFexFG1ayECm';
const { url: solanaExplorerUrl } = getExplorerUrl('solana-explorer', transactionSignature);
const { url: solscanUrl } = getExplorerUrl('solscan', transactionSignature);

console.log(solanaExplorerUrl); // "https://explorer.solana.com/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"

console.log(solscanUrl); // "https://solscan.io/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"
```

##### getAllExplorersUrl()

_Definition_

Returns all explorer URLs from [Solana Explorer](https://explorer.solana.com), [Solscan](https://solscan.io), [SolanaFM](https://solana.fm), and [Solana Beach](https://solanabeach.io).

_Example_

```typescript
import { getAllExplorersUrl } from 'solutils';

const transactionSignature = '55oJv5oCaez344JawHL5gnwqwrbrN4oD5ZN8rQFvyRSWzwXTTe178QG7KK9cR2wFkwecEca3V5vdbFexFG1ayECm';
const { urls } = getAllExplorersUrl(transactionSignature);

console.log(urls.solanaExplorerUrl); // "https://explorer.solana.com/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"

console.log(urls.solscanUrl); // "https://solscan.io/tx/5iY4JfaVwEBBfVvhrBqqWc3F75xqM32wiEzdwSRzFnddqBTLiErPJr2XsqgfdTQkr92ygW4duSWCjLAomCnTdu3a?cluster=mainnet-beta"
```

---

#### Serialization

##### getEncodedBufferFromData()

_Definition_

Returns a serialized buffer from a data array, to afterwards use in your instructions.

> ⚠️ WARNING: Data sent to getEncodedBufferFromData should be in correct order that the program receives it.

_Example_

```typescript
import { Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { getRpcEndpointUrl, getNewConnection, getEncodedBufferFromData, getExplorerUrl } from 'solutils';

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

_Definition_

Returns a serialized buffer from a data array, to afterwards use in your instructions.

> ⚠️ WARNING: Data sent to getEncodedBufferFromData should be in correct order that the program receives it.

_Example_

```typescript
import { getDecodedDataFromBufferAndSchema, getEncodedBufferFromData } from 'solutils';

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

_Definition_

Returns an empty buffer, needed when no data is mandatory to send to a Program.

_Example_

```typescript
import { getEmptyBuffer } from 'solutils';

const connection = getNewConnection('devnet');

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

_Definition_

Returns all details related to a transaction by sending its signature.

_Example_

```typescript
import { getTransactionDetails } from 'solutils';

const transactionSignature = '55oJv5oCaez344JawHL5gnwqwrbrN4oD5ZN8rQFvyRSWzwXTTe178QG7KK9cR2wFkwecEca3V5vdbFexFG1ayECm';

const { connection } = getNewConnection('mainnet-beta');
const { transactionDetails } = getTransactionDetails(transactionSignature, connection);

console.log(transactionDetails);
```

##### useTransactionDetails()

_Definition_

Same as previous method but in a hook form, accepting an `autoTrigger` which by defaults is true to automatically get transaction details. Also returns a `getTransactionDetails` method if you need to trigger the method through the UI.

_Example_

```tsx
import { useTransactionDetails } from 'solutils';

function DemoComponent() {
  // constants
  const transactionSignature =
    '55oJv5oCaez344JawHL5gnwqwrbrN4oD5ZN8rQFvyRSWzwXTTe178QG7KK9cR2wFkwecEca3V5vdbFexFG1ayECm';

  // solutils hooks
  const { result, status, error } = useTransactionDetails(transactionSignature);

  return (
    <div>
      {status === 'iddle' ? <p>Haven't request any transaction details yet</p> : null}
      {status === 'loading' ? <p>Requesting your transaction details</p> : null}
      {status === 'success' ? <pre>{JSON.stringify(null, 2, result)}</pre> : null}
      {status === 'error' ? <p>Ups, something wrong happened</p> : null}
    </div>
  );
}
```

---

#### IDLs

##### getIdlFromAddress()

_Definition_

Returns IDL from an specific address. Optionally you can use a different cluster as a second parameter, which by default will be `'mainnet-beta'`.
You can use this method in a hook form [useRequestIdlFromAddress()](#####useRequestIdlFromAddress>).

_Example_

```typescript
import { getIdlFromAddress } from 'solutils';

async function example() {
  const address = 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ';
  const { idl } = await getIdlFromAddress(address);

  console.log(idl); // { version: '4.4.0', name: 'candy_machine', ... }
}

example();
```

##### getInstructionFromIdl()

_Definition_

Returns a IDL instruction data (account and arguments) given his name.

_Example_

```typescript
import { getIdlFromAddress, getInstructionFromIdl } from 'solutils';

async function example() {
  const address = 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ';

  const { idl } = await getIdlFromAddress(address);
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

_Definition_

Returns a IDL from a particular address

_Example_

```tsx
import { useRequestIdlFromAddress } from 'solutils';

function DemoComponent() {
  // solutils hooks
  const { getIdlFromAddress, idl, status } = useRequestIdlFromAddress();

  // constants
  const address = 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ';

  // handlers
  async function handleIdlRequest() {
    await getIdlFromAddress(address);
    console.log('Operation finalized');
  }

  return (
    <div>
      <button onClick={handleIdlRequest}>Request IDL</button>
      {status === 'iddle' ? <p>Haven't request any IDL yet</p> : null}
      {status === 'loading' ? <p>Requesting your IDL</p> : null}
      {status === 'success' ? <pre>{JSON.stringify(null, 2, idl)}</pre> : null}
      {status === 'error' ? <p>Ups, something wrong happened</p> : null}
    </div>
  );
}
```

---

#### PDAs

##### getPdaFromSeedAndProgramAddress()

_Definition_

Returns PDAs public key and address from a string seed and a program address.

_Example_

```typescript
import { getPdaFromSeedAndProgramAddress } from 'solutils';

async function example() {
  const SEED = 'SOME_RANDOM_SEED';
  const PROGRAM_ADDRESS = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN';

  const { pdaPublicKey, pdaAddress, bump } = await getPdaFromSeedAndProgramAddress(SEED, PROGRAM_ADDRESS);
}

example();
```

##### usePdaFromUserPublicKeyAndProgramAddress()

_Definition_

Use it to get PDA public key and address using public key from user connected wallet and a pogram address. Optionally `getPdaFromUserPublicKeyAndProgramAddress` accepts a second argument with a seeds string array.

_Example_

```tsx
import { usePdaFromUserPublicKeyAndProgramAddress } from 'solutils';

function DemoComponent() {
  // solutils hooks
  const { getPdaFromUserPublicKeyAndProgramAddress, result, status, error } =
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
      {status === 'iddle' ? <p>Haven't request any PDA yet</p> : null}
      {status === 'loading' ? <p>Requesting PDA...</p> : null}
      {status === 'success' ? <p>We successfully get PDA address: {result.pdaAddress}</p> : null}
      {status === 'error' ? <p>Ups, something wrong happened</p> : null}
    </div>
  );
}
```

---

#### Blockchain

##### getSolanaStatus()

_Definition_

Returns a `isHealthy` boolean to know blockchain current status

_Example_

```typescript
import { getSolanaStatus } from 'solutils';

async function example() {
  const { isHealthy } = await getSolanaStatus();

  console.log(isHealthy); // true
}

example();
```

##### useSolanaStatus()

_Definition_

Same as previous method but by default re-fetchs Solana status every 30 seconds. Optionally refetching can be disabled using a false flag as a first parameter, and refetch interval could be also modified in ms as a second parameter.

_Example_

```tsx
import { useSolanaStatus } from 'solutils';

function DemoComponent() {
  // solutils hooks
  const { result, status, error } = useSolanaStatus();

  return (
    <div>
      {result === true ? <p>All systems are operational</p> : null}
      {result === false ? <p>Blockchain is having some issues</p> : null}
      {status === 'loading' ? <p>Requesting blockchain status</p> : null}
      {status === 'error' ? <p>Ups, something wrong happened</p> : null}
    </div>
  );
}
```

---

#### Tokens

##### useUserBalance()

_Definition_

Returns user current balance in SOL.

_Example_

```tsx
import { useUserBalance } from 'solutils';

function DemoComponent() {
  // solutils hooks
  const { getUserBalance, result, status } = useUserBalance();

  // handlers
  function handleUserBalanceRequest() {
    getUserBalance();
  }

  return (
    <div>
      <button onClick={handleUserBalanceRequest}>Request user balance</button>
      {status === 'iddle' ? <p>Haven't request any SOL balance yet</p> : null}
      {status === 'loading' ? <p>Requesting your SOL balance tokens</p> : null}
      {status === 'success' ? <p>We successfully get your balance: {userBalance} SOL</p> : null}
      {status === 'error' ? <p>Ups, something wrong happened</p> : null}
    </div>
  );
}
```

##### useRequestSolAirdrop()

_Definition_

Returns a function to request SOL airdrop for the connected wallet and a status variable to track transaction state.

_Example_

```tsx
import { useRequestSolAirdrop } from 'solutils';

function DemoComponent() {
  // solutils hooks
  const { getSolAirdrop, result, status, error } = useRequestSolAirdrop();

  // constants
  const SOL = 2;

  // handlers
  function handleSolRequest() {
    getSolAirdrop(SOL);
  }

  return (
    <div>
      <button onClick={handleSolRequest}>Request Airdrop</button>
      {status === 'iddle' ? <p>Haven't request any SOL yet</p> : null}
      {status === 'loading' ? <p>Airdroping your SOL tokens</p> : null}
      {status === 'success' ? (
        <div>
          <p>Your {SOL} tokens have arrived, check your wallet!</p>
          <p>Transaction signature: {result.transactionSignature}</p>
          <a href={result.urls.solscanUrl} target='_blank'>
            Solscan
          </a>
          <a href={result.urls.solanaExplorerUrl} target='_blank'>
            Solana Explorer
          </a>
        </div>
      ) : null}
      {status === 'error' ? <p>Ups, something wrong happened</p> : null}
    </div>
  );
}
```

##### useTransferSolTokens()

_Definition_

Use it to transfer SOL tokens from connected wallet to a specific address.

_Example_

```tsx
import { useTransferSolTokens } from 'solutils';

function DemoComponent() {
  // solutils hooks
  const { getTransferSolTokensReceipt, result, status, error } = useTransferSolTokens();

  // constants
  const SOL_TO_SEND = 0.5;
  const ADDRESS_TO_SEND = '5NSJUuR9Pn1yiFYGPWonqrVh72xxX8D2yADKrUf1USRc';

  // handlers
  function handleUserBalanceRequest() {
    getTransferSolTokensReceipt(SOL_TO_SEND, ADDRESS_TO_SEND);
  }

  return (
    <div>
      <button onClick={handleUserBalanceRequest}>Send {SOL_TO_SEND} SOL tokens</button>
      {status === 'iddle' ? <p>Haven't sent any SOL yet</p> : null}
      {status === 'loading' ? <p>Sending your SOL tokens</p> : null}
      {status === 'success' ? (
        <div>
          <p>We successfully sent: {SOL_TO_SEND} SOL</p>
          <p>Transaction signature: {result.transactionSignature}</p>
          <a href={result.urls.solscanUrl} target='_blank'>
            Solscan
          </a>
          <a href={result.urls.solanaExplorerUrl} target='_blank'>
            Solana Explorer
          </a>
        </div>
      ) : null}
      {status === 'error' ? <p>Ups, something wrong happened</p> : null}
    </div>
  );
}
```

---

#### Anchor

##### useAnchorProvider()

_Definition_

Returns an anchor provider receiving optionally a keypair parameter.

_Example_

```tsx
import { useAnchorProvider } from 'solutils';

function DemoComponent() {
  // solutils hooks
  const { provider } = useAnchorProvider();
}
```

---

### Authors

Thanks to Alejandro [@afreitezzz](https://twitter.com/afreitezzz) for creating the logo!
