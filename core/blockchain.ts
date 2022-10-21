import fetch from 'cross-fetch';

export type SolanaStatusData = {
  page: {
    id: string;
    name: string;
    url: string;
    time_zone: string;
    updated_at: string;
  };
  status: {
    indicator: string;
    description: string;
  };
};

export async function getSolanaStatus(): Promise<{ isHealthy: boolean }> {
  const response = await fetch('https://status.solana.com/api/v2/status.json');
  const { status }: SolanaStatusData = await response.json();

  const { description } = status;
  const isHealthy = description === 'All Systems Operational';

  return { isHealthy };
}
