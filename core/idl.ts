import { inflate } from 'pako';
import { PublicKey, Connection } from '@solana/web3.js';
import { utf8, decodeIdlAccount, Idl, IdlInstruction } from '@project-serum/anchor/dist/browser';

// internal helpers
import { getPublicKeyFromAddress } from './keypairs';

export async function getIdlFromAddress(address: string, connection: Connection): Promise<{ idl: Idl | null }> {
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
