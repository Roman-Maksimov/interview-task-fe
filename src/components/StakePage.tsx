import { useCurrentWallet } from '@mysten/dapp-kit';
import React, { useMemo, useState } from 'react';

import { useStake } from '../hooks/useStake';
import { useStakingData } from '../hooks/useStakingData';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import WalletConnect from './WalletConnect';

export default function StakePage() {
  const { currentWallet } = useCurrentWallet();
  const isConnected = !!currentWallet;
  const [amount, setAmount] = useState('');
  const {
    exchangeRate,
    isLoading: dataLoading,
    error: dataError,
  } = useStakingData();
  const { stake, result, reset } = useStake();

  const estimatedAfSui = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return '0';
    }
    return (parseFloat(amount) * exchangeRate).toFixed(6);
  }, [amount, exchangeRate]);

  const isValidAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1_000_000; // Maximum 1M SUI
  }, [amount]);

  const canStake =
    isConnected && isValidAmount && !result.isLoading && !dataLoading;

  const handleStake = async () => {
    if (!canStake) return;

    try {
      // Convert to minimal units (1 SUI = 10^9 MIST)
      const amountInMist = (parseFloat(amount) * 1e9).toString();
      await stake(amountInMist);
    } catch (error) {
      console.error('Error during staking:', error);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (result.error || result.success) {
        reset();
      }
    }
  };

  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stake SUI → afSUI</CardTitle>
          <CardDescription>
            Stake your SUI tokens and receive afSUI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount In (SUI)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={handleAmountChange}
              disabled={result.isLoading}
            />
            {amount && !isValidAmount && (
              <div className="text-sm text-red-500">
                Enter a valid SUI amount (0 to 1,000,000)
              </div>
            )}
          </div>

          {dataLoading && (
            <div className="text-sm text-gray-500">Loading data...</div>
          )}

          {dataError && (
            <div className="text-sm text-red-500">
              Error loading data: {dataError}
            </div>
          )}

          {!dataLoading && !dataError && (
            <div className="space-y-2">
              <Label>Estimated afSUI</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-semibold">
                  {estimatedAfSui} afSUI
                </div>
                <div className="text-sm text-gray-500">
                  Exchange rate: 1 SUI = {exchangeRate.toFixed(6)} afSUI
                </div>
              </div>
            </div>
          )}

          {result.error && (
            <div className="text-sm text-red-500">Error: {result.error}</div>
          )}

          {result.success && result.transactionDigest && (
            <div className="text-sm text-green-500">
              Transaction completed successfully!
              <br />
              Digest: {result.transactionDigest}
            </div>
          )}

          <Button onClick={handleStake} disabled={!canStake} className="w-full">
            {result.isLoading ? 'Processing...' : 'Stake'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
