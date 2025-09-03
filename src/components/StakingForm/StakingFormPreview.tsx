import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { EXTERNAL_FEE_PERCENTAGE } from '../../lib/constants';
import { Label } from '../../ui/label';
import { Skeleton } from '../../ui/skeleton';
import { StakingFormScheme, useStakingForm } from './useStakingForm';

export const StakingFormPreview: FC = () => {
  const { formState, watch } = useFormContext<StakingFormScheme>();
  const {
    stakingInfo,
    stakingInfoLoading,
    calculateExpectedAfSui,
    calculateExternalFee,
  } = useStakingForm();

  const amount = watch('amount');

  // Convert amount to number and validate
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  // Show validation errors
  if (formState.errors.amount) {
    return (
      <div className="space-y-2">
        <Label>Transaction Details</Label>
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            {formState.errors.amount.message}
          </div>
        </div>
      </div>
    );
  }

  if (
    !formState.isValid ||
    !amount ||
    isNaN(numericAmount) ||
    numericAmount <= 0
  ) {
    return null;
  }

  if (formState.isValidating || stakingInfoLoading) {
    return <Skeleton className="h-[173px] w-full" />;
  }

  if (!stakingInfo) {
    return null;
  }

  const estimatedAfSui = calculateExpectedAfSui(numericAmount);
  const externalFee = calculateExternalFee(numericAmount);
  const { apy, exchangeRate } = stakingInfo;

  return (
    <div className="space-y-2">
      <Label>Transaction Details</Label>
      <div className="p-3 bg-gray-50 rounded-md space-y-2">
        <div>
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

        <div className="border-t pt-2">
          <div className="text-sm font-medium text-gray-700">Fees:</div>
          <div className="text-sm text-gray-500">
            External fee: {externalFee.toFixed(6)} SUI (
            {(EXTERNAL_FEE_PERCENTAGE * 100).toFixed(1)}%)
          </div>
          <div className="text-sm font-medium text-gray-700">
            Total required: {(numericAmount + externalFee).toFixed(6)} SUI
          </div>
        </div>
      </div>
    </div>
  );
};
