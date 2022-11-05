import { useState, useEffect } from 'react';
import { TransactionSignature, ParsedTransactionWithMeta, Connection } from '@solana/web3.js';

// common
import { ErrorState, StatusState } from '../common';

// core
import { getTransactionDetails, getIsValidTransaction } from '../core';

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

  // effects
  useEffect(() => {
    async function fetchTransactionDetails() {
      try {
        setStatus('loading');
        const result = await getTransactionDetails(connection, transactionSignature);

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

  // effects
  useEffect(() => {
    async function fetchIsValidTransaction() {
      try {
        setStatus('loading');
        const result = await getIsValidTransaction(connection, transactionSignature);

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
