import { clusterApiUrl, Connection, Cluster } from '@solana/web3.js';

export function getClusterConnection(cluster: Cluster): {
  connection: Connection;
} {
  const clusterUrl = clusterApiUrl(cluster);
  const connection = new Connection(clusterUrl);

  return { connection };
}

export function getClusterName(cluster: Cluster): { clusterName: string } {
  const clusterNames = {
    devnet: 'Devnet',
    testnet: 'Testnet',
    'mainnet-beta': 'Mainnet',
  };
  const clusterName = clusterNames[cluster];

  return { clusterName };
}

export async function getClusterNameFromEndpoint(
  endpoint: string
): Promise<{ clusterName: Cluster | 'localnet' | 'unknown' }> {
  if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1')) {
    return { clusterName: 'localnet' };
  }

  const connection = new Connection(endpoint);
  const genesisHash = await connection.getGenesisHash();
  switch (genesisHash) {
    case 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG':
      return { clusterName: 'devnet' };
    case '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY':
      return { clusterName: 'testnet' };
    case '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d':
      return { clusterName: 'mainnet-beta' };
    default:
      return { clusterName: 'unknown' };
  }
}
