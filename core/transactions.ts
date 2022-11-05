import { Connection, Transaction, TransactionSignature, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';

// core
import { getLamportsToSol } from './units';

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

export async function getTransactionGasFee(
  transaction: Transaction,
  publicKey: PublicKey,
  connection: Connection,
): Promise<{ lamports: number; sol: number }> {
  const { blockhash: latestBlockhash } = await connection.getLatestBlockhash('finalized');
  Object.assign(transaction, { feePayer: publicKey, recentBlockhash: latestBlockhash });

  const gasFee = await transaction.getEstimatedFee(connection);
  const { sol } = getLamportsToSol(gasFee);

  return { lamports: gasFee, sol };
}
