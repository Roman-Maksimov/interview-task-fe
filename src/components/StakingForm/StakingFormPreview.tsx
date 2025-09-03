import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Label } from '../../../old/components/ui/label';
import { Skeleton } from '../../ui/skeleton';
import { StakingFormScheme } from './useStakingForm';

export const StakingFormPreview: FC = () => {
  const { formState, watch } = useFormContext<StakingFormScheme>();

  const amount = watch('amount');

  console.log(1234, formState.isValid, formState.isValidating);

  if (!formState.isValid) {
    return null;
  }

  if (formState.isValidating) {
    return <Skeleton className="h-4 w-full" />;
  }

  return (
    <div className="space-y-2">
      <Label>Estimated afSUI</Label>
      <div className="p-3 bg-gray-50 rounded-md">
        {/*<div className="text-lg font-semibold">{estimatedAfSui} afSUI</div>*/}
        {/*<div className="text-sm text-gray-500">*/}
        {/*  Exchange rate: 1 SUI = {exchangeRate.toFixed(6)} afSUI*/}
        {/*</div>*/}
      </div>
    </div>
  );
};
