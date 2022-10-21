import { clusterApiUrl, Connection, Cluster } from '@solana/web3.js';

export function getClusterConnection(cluster: Cluster): { connection: Connection } {
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
