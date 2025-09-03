import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useDebounce } from '../../hooks/useDebounce';
import { EXTERNAL_FEE_PERCENTAGE } from '../../lib/constants';
import { Label } from '../../ui/label';
import { Skeleton } from '../../ui/skeleton';
import { StakingFormScheme, useStakingForm } from './useStakingForm';

export const StakingFormPreview: FC = () => {
  const { formState, watch } = useFormContext<StakingFormScheme>();
  const {
    stakingInfo,
    stakingInfoLoading,
    calculateExternalFee,
    calculateAfSuiFromStakingAmount,
  } = useStakingForm();

  const amount = watch('amount');

  // Debounce the amount to avoid frequent recalculations
  const debouncedAmount = useDebounce(amount, 300);

  // Convert amount to number and validate
  const numericAmount =
    typeof debouncedAmount === 'string'
      ? parseFloat(debouncedAmount)
      : debouncedAmount;

  // Show loading state for debounced calculations or staking info
  const isCalculating =
    amount !== debouncedAmount || formState.isValidating || stakingInfoLoading;

  // Memoize calculations to avoid unnecessary recalculations
  const calculations = useMemo(() => {
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return null;
    }

    const externalFee = calculateExternalFee(numericAmount);
    const actualStakingAmount = numericAmount - externalFee;
    const estimatedAfSui = calculateAfSuiFromStakingAmount(actualStakingAmount);

    return {
      estimatedAfSui,
      externalFee,
      actualStakingAmount,
    };
  }, [numericAmount, calculateExternalFee, calculateAfSuiFromStakingAmount]);

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

  if (isCalculating) {
    return <Skeleton className="h-[173px] w-full" />;
  }

  if (!stakingInfo) {
    return null;
  }

  if (!calculations) {
    return null;
  }

  const { estimatedAfSui, externalFee, actualStakingAmount } = calculations;
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
          <div className="text-sm font-medium text-gray-700">Breakdown:</div>
          <div className="text-sm text-gray-500">
            Staking amount: {actualStakingAmount.toFixed(6)} SUI
          </div>
          <div className="text-sm text-gray-500">
            External fee: {externalFee.toFixed(6)} SUI (
            {(EXTERNAL_FEE_PERCENTAGE * 100).toFixed(1)}%)
          </div>
          <div className="text-sm font-medium text-gray-700">
            Total to spend: {numericAmount.toFixed(6)} SUI
          </div>
        </div>
      </div>
    </div>
  );
};
