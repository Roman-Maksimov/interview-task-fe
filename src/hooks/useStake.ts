import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useState } from 'react';

import { useAftermath } from './useAftermath';

export interface StakeResult {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  transactionDigest: string | null;
}

export function useStake() {
  const [result, setResult] = useState<StakeResult>({
    isLoading: false,
    error: null,
    success: false,
    transactionDigest: null,
  });

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const aftermathApi = useAftermath();

  const stake = async (amount: string) => {
    try {
      setResult({
        isLoading: true,
        error: null,
        success: false,
        transactionDigest: null,
      });

      if (!account) {
        throw new Error('No wallet connected');
      }

      // For now, we'll simulate a successful transaction
      // In a real implementation, you would use the Aftermath SDK properly
      // and create the actual staking transaction

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      const mockResponse = {
        digest: '0x' + Math.random().toString(16).substr(2, 64),
        effects: {},
        objectChanges: [],
      };

      setResult({
        isLoading: false,
        error: null,
        success: true,
        transactionDigest: mockResponse.digest,
      });

      return mockResponse;
    } catch (error) {
      console.error('Error during staking:', error);
      setResult({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        transactionDigest: null,
      });
      throw error;
    }
  };

  const reset = () => {
    setResult({
      isLoading: false,
      error: null,
      success: false,
      transactionDigest: null,
    });
  };

  return {
    stake,
    result,
    reset,
  };
}
