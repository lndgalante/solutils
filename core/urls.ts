import { Cluster, clusterApiUrl } from '@solana/web3.js';

function getClusterSuffix(connectionUrl: Cluster): { clusterSuffix: string } {
  if (connectionUrl === 'mainnet-beta') {
    return { clusterSuffix: '?cluster=mainnet' };
  }

  if (connectionUrl === 'devnet') {
    return { clusterSuffix: '?cluster=devnet' };
  }

  return { clusterSuffix: '' };
}

export function getSolanaExplorerUrl(signature: string, clusterSuffix: string): { url: string } {
  const lengthTypes = { 88: 'tx', 9: 'block', 44: 'address' };

  const type = lengthTypes[signature.length as 88 | 9 | 44];
  const url = `https://explorer.solana.com/${type}/${signature}${clusterSuffix}`;

  return { url };
}

export function getSolscanUrl(signature: string, clusterSuffix: string): { url: string } {
  const lengthTypes = { 88: 'tx', 9: 'block', 43: 'token', 44: 'address' };

  const type = lengthTypes[signature.length as 88 | 9 | 43 | 44] as string;
  const url = `https://solscan.io/${type}/${signature}${clusterSuffix}`;

  return { url };
}

export function getSolanaFm(signature: string, clusterSuffix: string): { url: string } {
  const lengthTypes = { 88: 'tx', 9: 'block', 44: 'address' };

  const type = lengthTypes[signature.length as 88 | 9 | 44] as string;
  const url = `https://solana.fm/${type}/${signature}${clusterSuffix}`;

  return { url };
}

export function getSolanaBeach(signature: string, clusterSuffix: string): { url: string } {
  const lengthTypes = { 88: 'transaction', 9: 'block', 44: 'address' };

  const type = lengthTypes[signature.length as 88 | 9 | 44] as string;
  const url = `https://solana.fm/${type}/${signature}${clusterSuffix}`;

  return { url };
}

export function getExplorerUrl(
  explorer: 'solana-explorer' | 'solscan' | 'solana-fm' | 'solana-beach',
  signature: string,
  cluster: Cluster = 'mainnet-beta',
): { url: string } {
  const { clusterSuffix } = getClusterSuffix(cluster);

  if (explorer === 'solana-explorer') {
    return getSolanaExplorerUrl(signature, clusterSuffix);
  }

  if (explorer === 'solscan') {
    return getSolscanUrl(signature, clusterSuffix);
  }

  if (explorer === 'solana-fm') {
    return getSolanaFm(signature, clusterSuffix);
  }

  if (explorer === 'solana-beach') {
    return getSolanaBeach(signature, clusterSuffix);
  }

  return { url: '' };
}

export type AllExplorerUrls = {
  solanaExplorerUrl: string;
  solscanUrl: string;
  solanaFmUrl: string;
  solanaBeachUrl: string;
};

export function getAllExplorersUrl(signature: string, cluster: Cluster = 'mainnet-beta'): { urls: AllExplorerUrls } {
  const { clusterSuffix } = getClusterSuffix(cluster);

  const { url: solanaExplorerUrl } = getSolanaExplorerUrl(signature, clusterSuffix);
  const { url: solscanUrl } = getSolscanUrl(signature, clusterSuffix);
  const { url: solanaFmUrl } = getSolanaFm(signature, clusterSuffix);
  const { url: solanaBeachUrl } = getSolanaBeach(signature, clusterSuffix);

  const urls = { solanaExplorerUrl, solscanUrl, solanaFmUrl, solanaBeachUrl };

  return { urls };
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
export type Network = 'mainnet' | 'devnet';

export function getRpcEndpointUrl(
  provider: Provider,
  network: Network,
  apiKeyOrAccessToken?: string,
): { rpcEndpointUrl: string } {
  const endpoints = {
    localhost: {
      mainnet: 'http://localhost:8899',
      devnet: 'http://localhost:8899',
    },
    solana: {
      mainnet: clusterApiUrl('mainnet-beta'),
      devnet: clusterApiUrl('devnet'),
    },
    serum: {
      mainnet: 'https://solana-api.projectserum.com',
      devnet: '',
    },
    genesysgo: {
      mainnet: 'https://ssc-dao.genesysgo.net',
      devnet: 'https://devnet.genesysgo.net',
    },
    allthatnode: {
      mainnet: 'https://solana-mainnet-rpc.allthatnode.com',
      devnet: 'https://solana-devnet-rpc.allthatnode.com',
    },
    blockdaemon: {
      mainnet: 'https://try-rpc.mainnet.solana.blockdaemon.tech',
      devnet: '',
    },
    ankr: {
      mainnet: 'https://rpc.ankr.com/solana',
      devnet: 'https://rpc.ankr.com/solana_devnet',
    },
    getblock: {
      mainnet: 'https://sol.getblock.io/mainnet',
      devnet: '',
    },
    metaplex: {
      mainnet: 'https://api.metaplex.solana.com',
      devnet: '',
    },
    alchemy: {
      mainnet: `https://solana-mainnet.g.alchemy.com/v2/${apiKeyOrAccessToken}`,
      devnet: `https://solana-devnet.g.alchemy.com/v2/${apiKeyOrAccessToken}`,
    },
    syndica: {
      mainnet: `https://solana-api.syndica.io/access-token/${apiKeyOrAccessToken}/rpc`,
      devnet: `https://solana-api.syndica.io/access-token/${apiKeyOrAccessToken}/rpc`,
    },
  };
  const rpcEndpointUrl = endpoints[provider][network];

  return { rpcEndpointUrl };
}
