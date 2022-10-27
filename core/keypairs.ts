import { Keypair, PublicKey } from '@solana/web3.js';

// common
import { getTruncatedText } from '../common';

export function getNewKeypair(): { keypair: Keypair } {
  const keypair = Keypair.generate();
  return { keypair };
}

/*

TODO: Make Node.js methods work when importing library on the browser

export function getKeypairFromFile(path?: string): { keypair: Keypair } {
  if (typeof window !== 'undefined') {
    throw new Error('getKeypairFromFile() is not supported in Browsers');
  }

  const parsedPath = path ?? `${require('os').homedir()}/.config/solana/id.json`;
  const fileContent = JSON.parse(require('fs').readFileSync(parsedPath, 'utf-8'));
  const keypair = Keypair.fromSecretKey(Buffer.from(fileContent));

  return { keypair };
}
*/

export function getKeypairFromSecretKey(secret: number[]): { keypair: Keypair } {
  const secretKey = Uint8Array.from(secret);
  const keypair = Keypair.fromSecretKey(secretKey);

  return { keypair };
}

export function getAddressFromPublicKey(publicKey: PublicKey): { address: string } {
  const address = publicKey.toString();
  return { address };
}

export function getPublicKeyFromAddress(address: string): { publicKey: PublicKey } {
  const publicKey = new PublicKey(address);
  return { publicKey };
}

export function getIsValidPublicKey(publicKey: PublicKey): { isValid: boolean } {
  const isValid = PublicKey.isOnCurve(publicKey);
  return { isValid };
}

export function getShortAddress(address: string): { shortAddress: string } {
  const shortAddress = getTruncatedText(address, 4, '...');
  return { shortAddress };
}
