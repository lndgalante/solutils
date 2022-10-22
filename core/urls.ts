import { Cluster, clusterApiUrl } from '@solana/web3.js';

export function getSolanaExplorerUrl(
  signature: string,
  cluster: Cluster = 'mainnet-beta',
): { solanaExplorerUrl: string } {
  const lengthTypes = { 88: 'tx', 9: 'block', 43: 'address' };

  const type = lengthTypes[signature.length as 88 | 9 | 43];
  const solanaExplorerUrl = `https://explorer.solana.com/${type}/${signature}?cluster=${cluster}`;

  return { solanaExplorerUrl };
}

export function getSolscanUrl(signature: string, cluster: Cluster = 'mainnet-beta'): { solscanUrl: string } {
  const lengthTypes = { 88: 'tx', 9: 'block', 43: 'account', 44: 'token' };

  const type = lengthTypes[signature.length as 88 | 9 | 43] as string;
  const solscanUrl = `https://solscan.io/${type}/${signature}?cluster=${cluster}`;

  return { solscanUrl };
}

export type Provider =
  | 'solana'
  | 'serum'
  | 'genesysgo'
  | 'allthatnode'
  | 'blockdaemon'
  | 'ankr'
  | 'getblock'
  | 'alchemy';
export type Network = 'mainnet' | 'devnet' | 'testnet';

export function getRpcEndpointUrl(provider: Provider, network: Network, apiKey?: string): { rpcEndpointUrl: string } {
  const endpoints = {
    localhost: {
      mainnet: 'http://localhost:8899',
      devnet: 'http://localhost:8899',
      testnet: 'http://localhost:8899',
    },
    solana: {
      mainnet: clusterApiUrl('mainnet-beta'),
      devnet: clusterApiUrl('devnet'),
      testnet: clusterApiUrl('testnet'),
    },
    serum: {
      mainnet: 'https://solana-api.projectserum.com',
      devnet: '',
      testnet: '',
    },
    genesysgo: {
      mainnet: 'https://ssc-dao.genesysgo.net',
      devnet: 'https://devnet.genesysgo.net',
      testnet: '',
    },
    allthatnode: {
      mainnet: 'https://solana-mainnet-rpc.allthatnode.com',
      devnet: 'https://solana-devnet-rpc.allthatnode.com',
      testnet: '',
    },
    blockdaemon: {
      mainnet: 'https://try-rpc.mainnet.solana.blockdaemon.tech',
      devnet: '',
      testnet: '',
    },
    ankr: {
      mainnet: 'https://rpc.ankr.com/solana',
      devnet: 'https://rpc.ankr.com/solana_devnet',
      testnet: '',
    },
    getblock: {
      mainnet: 'https://sol.getblock.io/mainnet',
      devnet: '',
      testnet: '',
    },
    metaplex: {
      mainnet: 'https://api.metaplex.solana.com',
      devnet: '',
      testnet: '',
    },
    alchemy: {
      mainnet: `https://solana-mainnet.g.alchemy.com/v2/${apiKey}`,
      devnet: `https://solana-devnet.g.alchemy.com/v2/${apiKey}`,
      testnet: '',
    },
  };
  const rpcEndpointUrl = endpoints[provider][network];

  return { rpcEndpointUrl };
}
