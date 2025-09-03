import React, { FC } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { MAX_STAKING_AMOUNT, MIN_STAKING_AMOUNT } from '../../lib/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Skeleton } from '../../ui/skeleton';
import { cn } from '../../utils/cn';
import { StakingFormPreview } from './StakingFormPreview';
import { StakingFormScheme, useStakingForm } from './useStakingForm';

export const StakingForm: FC = () => {
  const form = useForm<StakingFormScheme>({
    defaultValues: { amount: MIN_STAKING_AMOUNT },
  });
  const { submit, validateAmount, initialized } = useStakingForm();

  if (!initialized) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="max-w-md mx-auto space-y-6"
      >
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
              <Controller
                control={form.control}
                name="amount"
                rules={{
                  min: {
                    value: MIN_STAKING_AMOUNT,
                    message: 'Minimum amount is 0.01 SUI',
                  },
                  max: {
                    value: MAX_STAKING_AMOUNT,
                    message: 'Maximum amount is 1M SUI',
                  },
                  validate: validateAmount,
                }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <Input
                        id="amount"
                        type="number"
                        step={0.01}
                        placeholder="0.0"
                        className={cn({
                          'border-red-500': fieldState.error,
                        })}
                        {...field}
                      />
                      {fieldState.error && (
                        <span className="text-sm text-red-500">
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  );
                }}
              />
            </div>

            <StakingFormPreview />
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};
