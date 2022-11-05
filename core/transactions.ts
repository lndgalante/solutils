import { Connection, TransactionSignature, ParsedTransactionWithMeta } from '@solana/web3.js';

export async function getTransactionDetails(
  connection: Connection,
  transactionSignature: TransactionSignature,
): Promise<{ transactionDetails: ParsedTransactionWithMeta }> {
  const transactionDetails = await connection.getParsedTransaction(transactionSignature, 'finalized');

  if (!transactionDetails) {
    throw new Error('Transaction not found');
  }

  return { transactionDetails: transactionDetails as ParsedTransactionWithMeta };
}

export async function getIsValidTransaction(
  connection: Connection,
  transactionSignature: TransactionSignature,
): Promise<{ isValidTransaction: boolean }> {
  const status = await connection.getSignatureStatus(transactionSignature, { searchTransactionHistory: true });
  const isValidTransaction = status.value?.err === null && status.value?.confirmationStatus === 'finalized';

  return { isValidTransaction };
}
