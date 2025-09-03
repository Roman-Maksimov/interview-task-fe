import React, { FC, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { MAX_STAKING_AMOUNT, MIN_STAKING_AMOUNT } from '../../lib/constants';
import { Button } from '../../ui/button';
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
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { submit, validateAmount, initialized, stakingError, stakingSuccess } =
    useStakingForm();

  useEffect(() => {
    if (initialized) {
      form.trigger();
    }
  }, [form, initialized]);

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
                    message: 'Minimum amount is 1 SUI',
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
                        placeholder="0.00"
                        className={cn({
                          'border-red-500': fieldState.error,
                        })}
                        {...field}
                      />
                    </>
                  );
                }}
              />
            </div>

            <StakingFormPreview />

            {stakingError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{stakingError}</p>
              </div>
            )}

            {stakingSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{stakingSuccess}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Staking...' : 'Stake SUI'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};
