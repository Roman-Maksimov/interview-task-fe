import { Aftermath } from 'aftermath-ts-sdk';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, Validate } from 'react-hook-form';

import { COIN_SUI, NETWORK } from '../../lib/constants';
import { useAccountContext } from '../../providers/AccountProvider';
import { amountToDecimal } from '../../utils/amountToDecimal';

export interface StakingFormScheme {
  amount: number;
}

const afSdk = new Aftermath(NETWORK);

export const useStakingForm = () => {
  const [initialized, setInitialized] = useState(false);
  const [initializeError, setInitializeError] = useState<string>();
  const { address } = useAccountContext();

  useEffect(() => {
    (async () => {
      try {
        await afSdk.init();
        setInitialized(true);
      } catch (error) {
        // TODO: check error format
        setInitializeError((error as Error).message);
      }
    })();
  }, []);

  const submit = useCallback<SubmitHandler<StakingFormScheme>>(data => {
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

  const getExchangeRate = useCallback(async () => {
    if (!initialized) {
      return 0;
    }

    //
  }, []);

  return { initialized, initializeError, submit, validateAmount };
};
