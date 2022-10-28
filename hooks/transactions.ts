import { useState, useEffect } from 'react';
import { TransactionSignature, ParsedTransactionWithMeta, Connection } from '@solana/web3.js';

// common
import { ErrorState, StatusState } from '../common';

// types
type ResultState = { transactionDetails: ParsedTransactionWithMeta | null } | null;

export function useTransactionDetails(
  connection: Connection,
  transactionSignature: TransactionSignature,
  autoTrigger: boolean = true,
) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ResultState>(null);

  // helpers
  async function getTransactionDetails(
    transactionSignature: TransactionSignature,
  ): Promise<{ transactionDetails: ParsedTransactionWithMeta }> {
    const configuration = { maxSupportedTransactionVersion: 0 };
    const transactionDetails = await connection.getParsedTransaction(transactionSignature, configuration);

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
