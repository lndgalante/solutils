import { useState, useEffect } from 'react';
import { TransactionSignature, ParsedTransactionWithMeta, Connection } from '@solana/web3.js';

// common
import { ErrorState, StatusState } from '../common';

// types
type DetailsResultState = { transactionDetails: ParsedTransactionWithMeta } | null;

export function useTransactionDetails(
  connection: Connection,
  transactionSignature: TransactionSignature,
  autoTrigger: boolean = true,
) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<DetailsResultState>(null);

  // helpers
  async function getTransactionDetails(
    transactionSignature: TransactionSignature,
  ): Promise<{ transactionDetails: ParsedTransactionWithMeta }> {
    const transactionDetails = await connection.getParsedTransaction(transactionSignature, 'finalized');

    if (!transactionDetails) {
      throw new Error('Transaction not found');
    }

    return { transactionDetails: transactionDetails as ParsedTransactionWithMeta };
  }

  // effects
  useEffect(() => {
    async function fetchTransactionDetails() {
      try {
        setStatus('loading');
        const result = await getTransactionDetails(transactionSignature);

        setResult(result);
        setStatus('success');
      } catch (error) {
        setError((error as Error).message);
        setStatus('error');
      }
    }

    if (autoTrigger) {
      fetchTransactionDetails();
    }
  }, [transactionSignature, autoTrigger]);

  return { result, status, error, getTransactionDetails };
}

type ValidResultState = { isValidTransaction: boolean } | null;

export function useIsValidTransaction(
  connection: Connection,
  transactionSignature: TransactionSignature,
  autoTrigger: boolean = true,
) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ValidResultState>(null);

  // helpers
  async function getIsValidTransaction(
    transactionSignature: TransactionSignature,
  ): Promise<{ isValidTransaction: boolean }> {
    const status = await connection.getSignatureStatus(transactionSignature, { searchTransactionHistory: true });
    const isValidTransaction = status.value?.err === null && status.value?.confirmationStatus === 'finalized';

    return { isValidTransaction };
  }

  // effects
  useEffect(() => {
    async function fetchIsValidTransaction() {
      try {
        setStatus('loading');
        const result = await getIsValidTransaction(transactionSignature);

        setResult(result);
        setStatus('success');
      } catch (error) {
        setError((error as Error).message);
        setStatus('error');
      }
    }

    if (autoTrigger) {
      fetchIsValidTransaction();
    }
  }, [transactionSignature, autoTrigger]);

  return { result, status, error, getIsValidTransaction };
}
