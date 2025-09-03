// TODO: move to ENV_VARS
export const NETWORK = 'TESTNET' as const;
export const COIN_SUI = '0x2::sui::SUI';
export const DECIMALS = 9;
export const DECIMALS_MULTIPLIER = Math.pow(10, DECIMALS);

export const MIN_STAKING_AMOUNT = 0.01;
export const MAX_STAKING_AMOUNT = 1_000_000;
