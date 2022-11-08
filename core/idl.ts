import { inflate } from 'pako';
import invariant from 'tiny-invariant';
import { PublicKey, Connection } from '@solana/web3.js';
import { utf8, decodeIdlAccount, Idl, IdlInstruction } from '@project-serum/anchor/dist/browser';

// internal helpers
import { getPublicKeyFromAddress } from './keypairs';

export async function getIdlFromAddress(connection: Connection, address: string): Promise<{ idl: Idl }> {
  const { publicKey: programId } = getPublicKeyFromAddress(address);
  const [base] = await PublicKey.findProgramAddress([], programId);

  const idlAddress = await PublicKey.createWithSeed(base, 'anchor:idl', programId);
  const idlAccountInfo = await connection.getAccountInfo(idlAddress);

  invariant(idlAccountInfo, 'IDL account not found');

  const idlAccount = decodeIdlAccount(idlAccountInfo.data.slice(8));
  const inflatedIdl = inflate(idlAccount.data);
  const idl: Idl = JSON.parse(utf8.decode(inflatedIdl));

  return { idl: idl as Idl };
}

export function getInstructionFromIdl(idl: Idl, instructionName: string): { instruction: IdlInstruction } | Error {
  const instruction = idl.instructions.find((instruction) => instruction.name === instructionName);
  invariant(instruction, `Instruction ${instructionName} not found in IDL`);

  return { instruction };
}
