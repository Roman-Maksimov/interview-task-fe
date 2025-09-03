import { Aftermath } from 'aftermath-ts-sdk';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, Validate } from 'react-hook-form';

import { COIN_SUI, NETWORK } from '../../lib/constants';
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
  const { address } = useAccountContext();

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

  const submit = useCallback<SubmitHandler<StakingFormScheme>>(() => {
    //
  }, []);

  const getBalance = useCallback(async () => {
    if (!address) {
      return 0n;
    }

    const wallet = afSdk.Wallet(address);

    return wallet.getBalance({ coin: COIN_SUI });
  }, [address]);

  const validateAmount = useCallback<Validate<number, StakingFormScheme>>(
    async value => {
      const balance = await getBalance();

      if (amountToDecimal(value).greaterThan(balance)) {
        return 'Not enough balance';
      }

      return true;
    },
    [getBalance]
  );

  const getExchangeRate = useCallback(() => {
    return stakingInfo?.exchangeRate || 0;
  }, [stakingInfo]);

  const calculateExpectedAfSui = useCallback(
    (suiAmount: number) => {
      if (!stakingInfo?.exchangeRate) {
        return 0;
      }

      return suiAmount * stakingInfo.exchangeRate;
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
    getExchangeRate,
    calculateExpectedAfSui,
    loadStakingInfo,
  };
};
