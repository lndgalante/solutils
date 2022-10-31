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

export async function getIsValidTransaction(
  transactionSignature: TransactionSignature,
  connection: Connection,
): Promise<{ isValidTransaction: boolean }> {
  const status = await connection.getSignatureStatus(transactionSignature, { searchTransactionHistory: true });
  const isValidTransaction = status.value?.err === null && status.value?.confirmationStatus === 'finalized';

  return { isValidTransaction };
}
