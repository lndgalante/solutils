import { Keypair, PublicKey } from '@solana/web3.js';

// common
import { getTruncatedText } from '../common';

export function isAddress(address: string) {
  return address.length === 44;
}

export function getNewKeypair(): { keypair: Keypair } {
  const keypair = Keypair.generate();
  return { keypair };
}

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
