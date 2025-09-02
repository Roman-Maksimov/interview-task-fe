import { useSuiClient } from '@mysten/dapp-kit';
import { Aftermath } from 'aftermath-ts-sdk';
import { useMemo } from 'react';

export function useAftermath() {
  const suiClient = useSuiClient();

  const aftermathApi = useMemo(() => {
    return new Aftermath('TESTNET'); // TODO: move to ENV_VARS
  }, []);

  return aftermathApi;
}
