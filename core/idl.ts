import { inflate } from 'pako';
import { PublicKey, Cluster } from '@solana/web3.js';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { decodeIdlAccount, Idl, IdlInstruction } from '@project-serum/anchor/dist/cjs/idl';

// internal helpers
import { getClusterConnection } from './cluster';
import { getPublicKeyFromAddress } from './keypairs';

export async function getIdlFromAddress(
  address: string,
  cluster: Cluster = 'mainnet-beta',
): Promise<{ idl: Idl | null }> {
  const { connection } = getClusterConnection(cluster);
  const { publicKey: programId } = getPublicKeyFromAddress(address);

  const [base] = await PublicKey.findProgramAddress([], programId);

  const idlAddress = await PublicKey.createWithSeed(base, 'anchor:idl', programId);
  const idlAccountInfo = await connection.getAccountInfo(idlAddress);
  if (!idlAccountInfo) return { idl: null };

  const idlAccount = decodeIdlAccount(idlAccountInfo.data.slice(8));
  const inflatedIdl = inflate(idlAccount.data);
  const idl: Idl = JSON.parse(utf8.decode(inflatedIdl));

  return { idl };
}

export function getInstructionFromIdl(idl: Idl, instructionName: string): { instruction: IdlInstruction } | Error {
  const instruction = idl.instructions.find((instruction) => instruction.name === instructionName);
  if (!instruction) throw new Error(`Instruction ${instructionName} not found in IDL`);

  return { instruction };
}
