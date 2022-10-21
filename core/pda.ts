import { PublicKey } from '@solana/web3.js';

// core
import { getAddressFromPublicKey, getPublicKeyFromAddress } from './address';

export async function getPdaFromSeedAndProgramAddress(
  seed: string,
  programAddress: string,
): Promise<{ pdaPublickKey: PublicKey; pdaAddress: string; bump: number }> {
  const { publicKey: programPublicKey } = getPublicKeyFromAddress(programAddress);
  const [pdaPublickKey, bump] = await PublicKey.findProgramAddress([Buffer.from(seed)], programPublicKey);

  const { address: pdaAddress } = getAddressFromPublicKey(pdaPublickKey);

  return { pdaPublickKey, pdaAddress, bump };
}
