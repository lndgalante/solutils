import { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { TransactionSignature, ParsedTransactionWithMeta } from '@solana/web3.js';

// common
import { ErrorState, StatusState } from '../common/types';

// types
type ResultState = ParsedTransactionWithMeta | null;

export async function useTransactionDetails(transactionSignature: TransactionSignature, autoTrigger: boolean = true) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<ResultState>(null);

  // solana hooks
  const { connection } = useConnection();

  // helpers
  async function getTransactionDetails(
    transactionSignature: TransactionSignature,
  ): Promise<{ transactionDetails: ResultState }> {
    const configuration = { maxSupportedTransactionVersion: 0 };
    const transactionDetails = await connection.getParsedTransaction(transactionSignature, configuration);

    return { transactionDetails };
  }

  // effects
  useEffect(() => {
    async function fetchTransactionDetails() {
      try {
        setStatus('loading');

        const { transactionDetails } = await getTransactionDetails(transactionSignature);

        setResult(transactionDetails);
        setStatus('success');
      } catch (error) {
        setError(error);
        setStatus('error');
      }
    }

    if (autoTrigger) {
      fetchTransactionDetails();
    }
  }, [transactionSignature, autoTrigger]);

  return { result, status, error, getTransactionDetails };
}
