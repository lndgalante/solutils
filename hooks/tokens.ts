import { useState } from 'react';
import invariant from 'tiny-invariant';
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
  getSolToLamports,
  getAllExplorersUrl,
  confirmTransaction,
  getSplTokenDecimals,
  getTransactionGasFee,
  getPublicKeyFromAddress,
  sendAndConfirmTransaction,
  SUPPORTED_TOKEN_SYMBOLS,
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
    try {
      invariant(publicKey, () => new WalletNotConnectedError()?.message);
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

type TransefSolTokensResultState = {
  gasFee?: GasFee;
  urls?: AllExplorerUrls;
  transactionSignature?: TransactionSignature;
} | null;

export function useTransferTokens(
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
  async function getTransferTokensReceipt(
    recipientAddress: string,
    tokenSymbolOrAddress: TokenSymbols | string,
    amountToSend: number,
  ) {
    try {
      invariant(publicKey, () => new WalletNotConnectedError()?.message);
      setStatus('loading');

      let transactionSignature = '';

      if (tokenSymbolOrAddress === 'SOL') {
        const { lamports } = getSolToLamports(amountToSend);
        const { publicKey: recipientPublicKey } = getPublicKeyFromAddress(recipientAddress);

        const transferInstruction = SystemProgram.transfer({
          lamports,
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
        });
        const transaction = new Transaction().add(transferInstruction);

        if (withGasFee) {
          const gasFee = await getTransactionGasFee(transaction, publicKey, connection);
          setResult({ gasFee });
        }

        const confirmedTransaction = await sendAndConfirmTransaction(connection, transaction, sendTransaction);
        transactionSignature = confirmedTransaction.transactionSignature;
      } else {
        const isTokenAddress = isAddress(tokenSymbolOrAddress);
        const isTokenSupported = SUPPORTED_TOKEN_SYMBOLS.includes(tokenSymbolOrAddress as TokenSymbols);

        const isTokenSymbolNotSupported = !(!isTokenAddress && !isTokenSupported);
        invariant(isTokenSymbolNotSupported, () => `Token ${tokenSymbolOrAddress} is not supported`);

        const tokenMintAddress = isTokenAddress
          ? tokenSymbolOrAddress
          : TOKEN_SYMBOLS_TO_MINT_ADDRESS[tokenSymbolOrAddress];

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

        const confirmedTransaction = await sendAndConfirmTransaction(connection, transaction, sendTransaction);
        transactionSignature = confirmedTransaction.transactionSignature;
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

  return { result, status, error, getTransferTokensReceipt };
}
