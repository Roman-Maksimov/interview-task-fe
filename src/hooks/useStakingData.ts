import { useEffect, useState } from 'react';

import { useAftermath } from './useAftermath';

export interface StakingData {
  exchangeRate: number;
  totalStaked: string;
  isLoading: boolean;
  error: string | null;
}

export function useStakingData() {
  const [data, setData] = useState<StakingData>({
    exchangeRate: 0,
    totalStaked: '0',
    isLoading: true,
    error: null,
  });

  const aftermathApi = useAftermath();

  useEffect(() => {
    const fetchStakingData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        // Initialize SDK
        await aftermathApi.init();

        // Get staking data - using a mock exchange rate for now
        // In a real implementation, you would fetch this from the SDK
        const exchangeRate = 1.0; // This should be fetched from the actual staking data

        // Get total staked amount (example value)
        const totalStaked = '1000000'; // This will be replaced with real data

        setData({
          exchangeRate,
          totalStaked,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching staking data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    fetchStakingData();
  }, [aftermathApi]);

  return data;
}
