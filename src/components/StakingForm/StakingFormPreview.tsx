import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Label } from '../../ui/label';
import { Skeleton } from '../../ui/skeleton';
import { StakingFormScheme, useStakingForm } from './useStakingForm';

export const StakingFormPreview: FC = () => {
  const { formState, watch } = useFormContext<StakingFormScheme>();
  const { stakingInfo, stakingInfoLoading, calculateExpectedAfSui } =
    useStakingForm();

  const amount = watch('amount');

  if (!formState.isValid) {
    return null;
  }

  if (formState.isValidating || stakingInfoLoading) {
    return <Skeleton className="h-[96px] w-full" />;
  }

  if (!stakingInfo) {
    return null;
  }

  const estimatedAfSui = calculateExpectedAfSui(amount);
  const { apy, exchangeRate } = stakingInfo;

  return (
    <div className="space-y-2">
      <Label>Estimated afSUI</Label>
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="text-lg font-semibold">
          {estimatedAfSui.toFixed(6)} afSUI
        </div>
        <div className="text-sm text-gray-500">
          Exchange rate: 1 SUI = {exchangeRate.toFixed(6)} afSUI
        </div>
        {!!apy && (
          <div className="text-sm text-gray-500">
            APY: {(apy * 100).toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
};
