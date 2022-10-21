import { Connection, TransactionSignature, ParsedTransactionWithMeta } from '@solana/web3.js';

export async function getTransactionDetails(
  transactionSignature: TransactionSignature,
  connection: Connection,
): Promise<{ transactionDetails: ParsedTransactionWithMeta | null }> {
  const configuration = { maxSupportedTransactionVersion: 0 };
  const transactionDetails = await connection.getParsedTransaction(transactionSignature, configuration);

  return { transactionDetails };
}
