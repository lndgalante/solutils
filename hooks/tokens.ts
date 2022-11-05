import { useState } from 'react';
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { PublicKey, Transaction, SystemProgram, TransactionSignature, Connection } from '@solana/web3.js';
import { WalletNotConnectedError, WalletAdapterProps, SignerWalletAdapterProps } from '@solana/wallet-adapter-base';
// import { WalletNotConnectedError, WalletAdapterProps } from '@solana/wallet-adapter-base';

// common
import { ErrorState, StatusState } from '../common';

// core
import {
  AllExplorerUrls,
  getLamportsToSol,
  getSolToLamports,
  getAllExplorersUrl,
  getSplTokenDecimals,
  getPublicKeyFromAddress,
} from '../core';

// types
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

      const {
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();
      const confirmation = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: transactionSignature,
      });

      if (confirmation.value.err) {
        throw new Error(confirmation.value as any);
      }

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
  urls: AllExplorerUrls;
  transactionSignature: TransactionSignature;
} | null;

export function useTransferSolTokens(
  publicKey: PublicKey | null,
  connection: Connection,
  sendTransaction: WalletAdapterProps['sendTransaction'],
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
        throw new Error(confirmation.value as any);
      }

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
  urls: AllExplorerUrls;
  transactionSignature: TransactionSignature;
} | null;

export function useTransferSplTokens(
  publicKey: PublicKey | null,
  connection: Connection,
  sendTransaction: WalletAdapterProps['sendTransaction'],
  signTransaction: SignerWalletAdapterProps['signTransaction'],
) {
  // react hooks
  const [error, setError] = useState<ErrorState>(null);
  const [status, setStatus] = useState<StatusState>('iddle');
  const [result, setResult] = useState<TransefSplTokensResultState>(null);

  // helpers

  // TODO: Instead of supporting any address support only the ones that are supported by the wallet
  //          i.e: USDC, USDT, SOL, and then map it to it token address
  async function getTransferSplTokensReceipt(tokenMintAddress: string, recipientAddress: string, amountToSend: number) {
    if (!publicKey) {
      throw new WalletNotConnectedError();
    }

    try {
      setStatus('loading');

      const { publicKey: tokenMintPublicKey } = getPublicKeyFromAddress(tokenMintAddress);
      const { publicKey: recipientPublicKey } = getPublicKeyFromAddress(recipientAddress);

      const { splTokenDecimals } = await getSplTokenDecimals(connection, tokenMintPublicKey);
      console.log('\n ~ getTransferSplTokensReceipt ~ splTokenDecimals', splTokenDecimals);

      /* const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromPublicKey,
        tokenPublicKey,
        fromPublicKey,
        signTransaction // Don't pass that if you have the private key as a string
      );

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromPublicKey,
        tokenPublicKey,
        toPublicKey,
        signTransaction // Don't pass that if you have the private key as a string
      ); */

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        // @ts-expect-error
        publicKey,
        tokenMintPublicKey,
        publicKey,
        signTransaction,
      );
      console.log('\n ~ getTransferSplTokensReceipt ~ fromTokenAccount', fromTokenAccount);

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        // @ts-expect-error
        publicKey,
        tokenMintPublicKey,
        recipientPublicKey,
        signTransaction,
      );
      console.log('\n ~ getTransferSplTokensReceipt ~ toTokenAccount', toTokenAccount);

      const amount = amountToSend * Math.pow(10, splTokenDecimals);
      console.log('\n ~ getTransferSplTokensReceipt ~ amount', amount);

      const transferInstruction = createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        publicKey,
        amount,
      );
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
        throw new Error(confirmation.value as any);
      }

      const { urls } = getAllExplorersUrl(transactionSignature);
      const result = { transactionSignature, urls };

      setStatus('success');
      setResult(result);

      return result;
    } catch (error) {
      console.log('\n ~ getTransferSplTokensReceipt ~ error', error);
      setStatus('error');
      setError((error as Error).message);
      return null;
    }
  }

  return { result, status, error, getTransferSplTokensReceipt };
}
