import { useState } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, TransactionSignature } from '@solana/web3.js';

// common
import { ErrorState, StatusState } from '../common';

// core
import {
  AllExplorerUrls,
  getLamportsToSol,
  getSolToLamports,
  getAllExplorersUrl,
  getPublicKeyFromAddress,
} from '../core';

// types
type AirdropResultState = {
  urls: AllExplorerUrls;
  transactionSignature: TransactionSignature;
} | null;

export function useRequestSolAirdrop() {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<AirdropResultState>(null);

  // solana hooks
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // helpers
  async function getSolAirdrop(solana: number = 1): Promise<{ transactionSignature: string } | null> {
    if (!publicKey) {
      throw new WalletNotConnectedError();
    }

    const { lamports } = getSolToLamports(solana);

    try {
      setStatus('loading');
      const transactionSignature = await connection.requestAirdrop(publicKey, lamports);

      const {
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();
      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: transactionSignature,
      });

      if (confirmation.value.err) {
        setStatus('error');
        setError(confirmation.value as any);
        return null;
      }

      const { urls } = getAllExplorersUrl(transactionSignature);
      const result = { transactionSignature, urls };

      setResult(result);
      setStatus('success');

      return result;
    } catch (error) {
      setError(error as Error);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getSolAirdrop };
}

type UserBalanceResultState = number;

export function useUserBalance() {
  // react hooks
  const [result, setResult] = useState<UserBalanceResultState>(0);
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');

  // solana hooks
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // helpers
  async function getUserBalance() {
    try {
      setStatus('loading');

      const lamports = await connection.getBalance(publicKey as PublicKey);
      const { sol } = getLamportsToSol(lamports);

      setResult(sol);
      setStatus('success');

      return sol;
    } catch (error) {
      setError(error as Error);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getUserBalance };
}

type TransefSolTokensResultState = {
  urls: AllExplorerUrls;
  transactionSignature: TransactionSignature;
} | null;

export function useTransferSolTokens() {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<TransefSolTokensResultState>(null);

  // solana hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // helpers
  async function getTransferSolTokensReceipt(solAmountToSend: number, addressToSend: string) {
    try {
      setStatus('loading');

      const { lamports } = getSolToLamports(solAmountToSend);
      const { publicKey: toPubkey } = getPublicKeyFromAddress(addressToSend);

      const transferInstruction = SystemProgram.transfer({ fromPubkey: publicKey as PublicKey, toPubkey, lamports });
      const transaction = new Transaction().add(transferInstruction);

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const transactionSignature = await sendTransaction(transaction, connection, { minContextSlot });
      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: transactionSignature,
      });

      if (confirmation.value.err) {
        setStatus('error');
        setError(confirmation.value as any);
        return;
      }

      const { urls } = getAllExplorersUrl(transactionSignature);
      const result = { transactionSignature, urls };

      setStatus('success');
      setResult(result);

      return result;
    } catch (error) {
      setError(error as Error);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getTransferSolTokensReceipt };
}
