import invariant from 'tiny-invariant';
import { Commitment, Connection, ParsedAccountData, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import {
  TokenInvalidMintError,
  TokenInvalidOwnerError,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const TOKEN_SYMBOLS_TO_MINT_ADDRESS = {
  SOL: SystemProgram.programId,
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

export const SUPPORTED_TOKEN_SYMBOLS = Object.keys(TOKEN_SYMBOLS_TO_MINT_ADDRESS) as TokenSymbols[];

export type TokenSymbols = keyof typeof TOKEN_SYMBOLS_TO_MINT_ADDRESS;

export async function getSplTokenDecimals(
  connection: Connection,
  tokenMintPublicKey: PublicKey,
): Promise<{ splTokenDecimals: number }> {
  const mintAccountInformation = await connection.getParsedAccountInfo(tokenMintPublicKey);
  invariant(mintAccountInformation.value, 'Mint account not found');

  const mintAccountData = mintAccountInformation.value.data as ParsedAccountData;
  const splTokenDecimals = mintAccountData.parsed.info.decimals as number;

  return { splTokenDecimals };
}

export async function getOrCreateAssociatedTokenAccountClientSide(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  sendTransaction,
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
) {
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId,
  );
  let account;

  try {
    account = await getAccount(connection, associatedToken, commitment, programId);
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      try {
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId,
          ),
        );
        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature);
      } catch (error) {}
      account = await getAccount(connection, associatedToken, commitment, programId);
    } else {
      throw error;
    }
  }

  invariant(account.mint.equals(mint), () => new TokenInvalidMintError()?.message);
  invariant(account.owner.equals(owner), () => new TokenInvalidOwnerError()?.message);

  return account;
}
