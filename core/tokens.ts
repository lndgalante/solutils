import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';

export async function getSplTokenDecimals(
  tokenMintPublicKey: PublicKey,
  connection: Connection,
): Promise<{ splTokenDecimals: number }> {
  const mintAccountInformation = await connection.getParsedAccountInfo(tokenMintPublicKey);

  if (!mintAccountInformation.value) {
    throw new Error(`No account information found for mint.`);
  }

  const mintAccountData = mintAccountInformation.value.data as ParsedAccountData;
  const splTokenDecimals = mintAccountData.parsed.info.decimals as number;

  return { splTokenDecimals };
}
