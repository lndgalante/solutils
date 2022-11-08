import { useState } from 'react';
import { createTransferInstruction } from '@solana/spl-token';
import { WalletNotConnectedError, WalletAdapterProps } from '@solana/wallet-adapter-base';
import { PublicKey, Transaction, SystemProgram, TransactionSignature, Connection } from '@solana/web3.js';

// common
import { ErrorState, StatusState } from '../common';

// core
import {
  isAddress,
  TokenSymbols,
  AllExplorerUrls,
  getLamportsToSol,
  getSolToLamports,
  getAllExplorersUrl,
  confirmTransaction,
  getSplTokenDecimals,
  getTransactionGasFee,
  getPublicKeyFromAddress,
  sendAndConfirmTransaction,
  TOKEN_SYMBOLS_TO_MINT_ADDRESS,
  getOrCreateAssociatedTokenAccountClientSide,
} from '../core';

// types
type GasFee = { sol: number; lamports: number };

type AirdropResultState = {
  urls: AllExplorerUrls;
  transactionSignature: TransactionSignature;
} | null;

export function useRequestSolAirdrop(publicKey: PublicKey | null, connection: Connection) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<AirdropResultState>(null);

  // helpers
  async function getSolAirdrop(solana: number = 1): Promise<{ transactionSignature: string } | null> {
    if (!publicKey) {
      throw new WalletNotConnectedError();
    }

    try {
      setStatus('loading');
      const { lamports } = getSolToLamports(solana);

      const transactionSignature = await connection.requestAirdrop(publicKey, lamports);
      await confirmTransaction(connection, transactionSignature);

      const { urls } = getAllExplorersUrl(transactionSignature);
      const result = { transactionSignature, urls };

      setResult(result);
      setStatus('success');

      return result;
    } catch (error) {
      setError((error as Error).message);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getSolAirdrop };
}

type UserBalanceResultState = number;

export function useUserBalance(publicKey: PublicKey | null, connection: Connection) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<UserBalanceResultState>(0);

  // helpers
  async function getUserBalance() {
    if (!publicKey) {
      throw new WalletNotConnectedError();
    }

    try {
      setStatus('loading');

      const lamports = await connection.getBalance(publicKey as PublicKey);
      const { sol } = getLamportsToSol(lamports);

      setResult(sol);
      setStatus('success');

      return sol;
    } catch (error) {
      setError((error as Error).message);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getUserBalance };
}

type TransefSolTokensResultState = {
  gasFee?: GasFee;
  urls?: AllExplorerUrls;
  transactionSignature?: TransactionSignature;
} | null;

export function useTransferSolTokens(
  publicKey: PublicKey | null,
  connection: Connection,
  sendTransaction: WalletAdapterProps['sendTransaction'],
  withGasFee: boolean = false,
) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<TransefSolTokensResultState>(null);

  // helpers
  async function getTransferSolTokensReceipt(recipientAddress: string, solAmountToSend: number) {
    if (!publicKey) {
      throw new WalletNotConnectedError();
    }

    try {
      setStatus('loading');

      const { lamports } = getSolToLamports(solAmountToSend);
      const { publicKey: toPubkey } = getPublicKeyFromAddress(recipientAddress);

      const transferInstruction = SystemProgram.transfer({ fromPubkey: publicKey as PublicKey, toPubkey, lamports });
      const transaction = new Transaction().add(transferInstruction);

      if (withGasFee) {
        const gasFee = await getTransactionGasFee(transaction, publicKey, connection);
        setResult({ gasFee });
      }

      const { transactionSignature } = await sendAndConfirmTransaction(connection, transaction, sendTransaction);

      const { urls } = getAllExplorersUrl(transactionSignature);
      const result = { transactionSignature, urls };

      setStatus('success');
      setResult(result);

      return result;
    } catch (error) {
      setError((error as Error).message);
      setStatus('error');
      return null;
    }
  }

  return { result, status, error, getTransferSolTokensReceipt };
}

type TransefSplTokensResultState = {
  gasFee?: GasFee;
  urls?: AllExplorerUrls;
  transactionSignature?: TransactionSignature;
} | null;

export function useTransferSplTokens(
  publicKey: PublicKey | null,
  connection: Connection,
  sendTransaction: WalletAdapterProps['sendTransaction'],
  withGasFee: boolean = false,
) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<TransefSplTokensResultState>(null);

  // helpers
  async function getTransferSplTokensReceipt(
    recipientAddress: string,
    tokenSymbolOrTokenAddress: TokenSymbols | string,
    amountToSend: number,
  ) {
    if (!publicKey) {
      throw new WalletNotConnectedError();
    }

    try {
      setStatus('loading');

      const tokenMintAddress = isAddress(tokenSymbolOrTokenAddress)
        ? tokenSymbolOrTokenAddress
        : TOKEN_SYMBOLS_TO_MINT_ADDRESS[tokenSymbolOrTokenAddress];

      const { publicKey: tokenMintPublicKey } = getPublicKeyFromAddress(tokenMintAddress);
      const { publicKey: recipientPublicKey } = getPublicKeyFromAddress(recipientAddress);

      const senderTokenAccount = await getOrCreateAssociatedTokenAccountClientSide(
        connection,
        publicKey,
        tokenMintPublicKey,
        publicKey,
        sendTransaction,
      );

      const recipientTokenAccount = await getOrCreateAssociatedTokenAccountClientSide(
        connection,
        publicKey,
        tokenMintPublicKey,
        recipientPublicKey,
        sendTransaction,
      );

      const { splTokenDecimals } = await getSplTokenDecimals(connection, tokenMintPublicKey);
      const amount = amountToSend * Math.pow(10, splTokenDecimals);

      const transferInstruction = createTransferInstruction(
        senderTokenAccount.address,
        recipientTokenAccount.address,
        publicKey,
        amount,
      );

      const transaction = new Transaction().add(transferInstruction);

      if (withGasFee) {
        const gasFee = await getTransactionGasFee(transaction, publicKey, connection);
        setResult({ gasFee });
      }

      const { transactionSignature } = await sendAndConfirmTransaction(connection, transaction, sendTransaction);

      const { urls } = getAllExplorersUrl(transactionSignature);
      const result = { transactionSignature, urls };

      setStatus('success');
      setResult(result);

      return result;
    } catch (error) {
      setStatus('error');
      setError((error as Error).message);
      return null;
    }
  }

  return { result, status, error, getTransferSplTokensReceipt };
}
