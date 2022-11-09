import invariant from 'tiny-invariant';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { Connection, Transaction, TransactionSignature, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';

// core
import { getLamportsToSol } from './units';

export async function getTransactionDetails(
  connection: Connection,
  transactionSignature: TransactionSignature,
): Promise<{ transactionDetails: ParsedTransactionWithMeta }> {
  const transactionDetails = await connection.getParsedTransaction(transactionSignature, 'finalized');
  invariant(transactionDetails, 'Transaction not found');

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

export async function confirmTransaction(connection: Connection, signature: TransactionSignature): Promise<void> {
  const {
    value: { blockhash, lastValidBlockHeight },
  } = await connection.getLatestBlockhashAndContext();

  const confirmation = await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  });

  invariant(confirmation.value.err === null, confirmation.value as any);
}

export async function sendAndConfirmTransaction(
  connection: Connection,
  transaction: Transaction,
  sendTransaction: WalletAdapterProps['sendTransaction'],
): Promise<{ transactionSignature: TransactionSignature }> {
  const minContextSlot = await connection.getSlot();
  const transactionSignature = await sendTransaction(transaction, connection, { minContextSlot });

  await confirmTransaction(connection, transactionSignature);

  return { transactionSignature };
}
