import { Commitment, Connection, ParsedAccountData, PublicKey, Transaction } from '@solana/web3.js';
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
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

export type TokenSymbols = keyof typeof TOKEN_SYMBOLS_TO_MINT_ADDRESS;

export async function getSplTokenDecimals(
  connection: Connection,
  tokenMintPublicKey: PublicKey,
): Promise<{ splTokenDecimals: number }> {
  const mintAccountInformation = await connection.getParsedAccountInfo(tokenMintPublicKey);

  if (!mintAccountInformation.value) {
    throw new Error(`No account information found for mint.`);
  }

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
  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account;

  try {
    account = await getAccount(connection, associatedToken, commitment, programId);
  } catch (error) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
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
      } catch (error) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }
      // Now this should always succeed
      account = await getAccount(connection, associatedToken, commitment, programId);
    } else {
      throw error;
    }
  }
  if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
  if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError();

  return account;
}
