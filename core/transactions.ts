import { Connection, TransactionSignature, ParsedTransactionWithMeta } from '@solana/web3.js';

export async function getTransactionDetails(
  transactionSignature: TransactionSignature,
  connection: Connection,
): Promise<{ transactionDetails: ParsedTransactionWithMeta }> {
  const transactionDetails = await connection.getParsedTransaction(transactionSignature, 'finalized');

  if (!transactionDetails) {
    throw new Error('Transaction not found');
  }

  return { transactionDetails: transactionDetails as ParsedTransactionWithMeta };
}
