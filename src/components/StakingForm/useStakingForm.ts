import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Aftermath } from 'aftermath-ts-sdk';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, Validate } from 'react-hook-form';

import {
  COIN_SUI,
  EXTERNAL_FEE_PERCENTAGE,
  NETWORK,
} from '../../lib/constants';
import { useAccountContext } from '../../providers/AccountProvider';
import { amountToDecimal } from '../../utils/amountToDecimal';

export interface StakingFormScheme {
  amount: number;
}

export interface StakingInfo {
  exchangeRate: number;
  apy: number;
  validators: Array<{
    suiAddress: string;
    name: string;
    apy: number;
  }>;
  tvl: bigint;
}

const afSdk = new Aftermath(NETWORK);

export const useStakingForm = () => {
  const [initialized, setInitialized] = useState(false);
  const [initializeError, setInitializeError] = useState<string>();
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [stakingInfoLoading, setStakingInfoLoading] = useState(false);
  const [stakingError, setStakingError] = useState<string>();
  const [stakingSuccess, setStakingSuccess] = useState<string>();
  const { address } = useAccountContext();
  const signAndExecuteTransactionMutation = useSignAndExecuteTransaction();

  const loadStakingInfo = useCallback(async () => {
    if (!initialized) return;

    setStakingInfoLoading(true);

    try {
      const staking = afSdk.Staking();

      // Get all necessary data in parallel
      const [exchangeRate, /*apy,*/ validators, apys, tvl] = await Promise.all([
        staking.getAfSuiToSuiExchangeRate(),
        // staking.getApy(), // TODO: endpoint doesn't work
        staking.getActiveValidators(),
        staking.getValidatorApys(),
        staking.getSuiTvl(),
      ]);

      // Combine validator data with their APY
      const validatorsWithApy = validators.map((validator, index) => ({
        suiAddress: validator.suiAddress,
        name: validator.name || `Validator ${index + 1}`,
        apy: (apys as unknown as Record<string, number>)[index] || 0,
      }));

      setStakingInfo({
        exchangeRate: Number(exchangeRate),
        apy: 0, //Number(apy), // TODO: endpoint doesn't work
        validators: validatorsWithApy,
        tvl,
      });
    } catch (error) {
      console.error('Error loading staking information:', error);
    } finally {
      setStakingInfoLoading(false);
    }
  }, [initialized]);

  useEffect(() => {
    (async () => {
      try {
        await afSdk.init();
        setInitialized(true);
        await loadStakingInfo();
      } catch (error) {
        // TODO: check error format
        setInitializeError((error as Error).message);
      }
    })();
  }, [loadStakingInfo]);

  const submit = useCallback<SubmitHandler<StakingFormScheme>>(
    async data => {
      if (!address || !stakingInfo?.validators.length) {
        setStakingError('Wallet not connected or no validators available');
        return;
      }

      setStakingError(undefined);
      setStakingSuccess(undefined);

      try {
        const staking = afSdk.Staking();

        // Use the first available validator
        const validatorAddress = stakingInfo.validators[0]?.suiAddress;
        if (!validatorAddress) {
          setStakingError('No validators available');
          return;
        }

        // Calculate actual staking amount (total - fee)
        const externalFeeAmount = data.amount * EXTERNAL_FEE_PERCENTAGE;
        const actualStakingAmount = data.amount - externalFeeAmount;

        // Create stake transaction with external fee
        const stakeTx = await staking.getStakeTransaction({
          walletAddress: address,
          suiStakeAmount: BigInt(amountToDecimal(data.amount).toString()),
          validatorAddress,
          externalFee: {
            recipient: address, // Fee goes to the user's address
            feePercentage: EXTERNAL_FEE_PERCENTAGE,
          },
          isSponsoredTx: false,
        });

        // Sign and execute transaction
        const result = await signAndExecuteTransactionMutation.mutateAsync({
          transaction: stakeTx,
        });

        console.log('Staking transaction successful:', result);

        // Set success message
        const afSuiAmount = stakingInfo?.exchangeRate
          ? actualStakingAmount * stakingInfo.exchangeRate
          : 0;

        setStakingSuccess(
          `Successfully staked ${actualStakingAmount.toFixed(6)} SUI (from ${data.amount} SUI total) and received ${afSuiAmount.toFixed(6)} afSUI!`
        );

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setStakingSuccess(undefined);
        }, 5000);

        // Reload staking info to get updated data
        await loadStakingInfo();
      } catch (error) {
        console.error('Staking transaction failed:', error);
        setStakingError((error as Error).message || 'Transaction failed');
      }
    },
    [address, stakingInfo, loadStakingInfo, signAndExecuteTransactionMutation]
  );

  const getBalance = useCallback(async () => {
    if (!address) {
      return 0n;
    }

    const wallet = afSdk.Wallet(address);

    return wallet.getBalance({ coin: COIN_SUI });
  }, [address]);

  const validateAmount = useCallback<Validate<number, StakingFormScheme>>(
    async value => {
      // Convert string to number and validate
      const numericValue = parseFloat(`${value}`);

      if (!value || isNaN(numericValue) || numericValue <= 0) {
        return 'Please enter a valid amount';
      }

      const balance = await getBalance();
      const totalAmountInWei = amountToDecimal(numericValue);

      // Calculate external fee (percentage of the total amount)
      const externalFeeAmount = numericValue * EXTERNAL_FEE_PERCENTAGE;

      // Actual staking amount = total amount - external fee
      const actualStakingAmount = numericValue - externalFeeAmount;

      // Check if actual staking amount is positive
      if (actualStakingAmount <= 0) {
        return `Amount too small. After ${(EXTERNAL_FEE_PERCENTAGE * 100).toFixed(1)}% fee, staking amount would be ${actualStakingAmount.toFixed(6)} SUI`;
      }

      // Check if user has enough balance for the total amount
      if (totalAmountInWei.greaterThan(balance)) {
        return `Not enough balance. Need ${numericValue.toFixed(6)} SUI total (${actualStakingAmount.toFixed(6)} SUI staking + ${externalFeeAmount.toFixed(6)} SUI fee)`;
      }

      return true;
    },
    [getBalance]
  );

  const getExchangeRate = useCallback(() => {
    return stakingInfo?.exchangeRate || 0;
  }, [stakingInfo]);

  const calculateExpectedAfSui = useCallback(
    (totalSuiAmount: number) => {
      if (!stakingInfo?.exchangeRate) {
        return 0;
      }

      // Calculate actual staking amount (total - fee)
      const externalFeeAmount = totalSuiAmount * EXTERNAL_FEE_PERCENTAGE;
      const actualStakingAmount = totalSuiAmount - externalFeeAmount;

      return actualStakingAmount * stakingInfo.exchangeRate;
    },
    [stakingInfo]
  );

  const calculateExternalFee = useCallback((suiAmount: number) => {
    if (!suiAmount || typeof suiAmount !== 'number' || isNaN(suiAmount)) {
      return 0;
    }
    return suiAmount * EXTERNAL_FEE_PERCENTAGE;
  }, []);

  const calculateAfSuiFromStakingAmount = useCallback(
    (stakingAmount: number) => {
      if (!stakingInfo?.exchangeRate) {
        return 0;
      }
      return stakingAmount * stakingInfo.exchangeRate;
    },
    [stakingInfo]
  );

  return {
    initialized,
    initializeError,
    submit,
    validateAmount,
    stakingInfo,
    stakingInfoLoading,
    stakingError,
    stakingSuccess,
    getExchangeRate,
    calculateExpectedAfSui,
    calculateExternalFee,
    calculateAfSuiFromStakingAmount,
    loadStakingInfo,
  };
};
