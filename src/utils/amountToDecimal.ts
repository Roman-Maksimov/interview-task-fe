import Decimal from 'decimal.js';

import { DECIMALS_MULTIPLIER } from '../lib/constants';

export const amountToDecimal = (amount: Decimal.Value) => {
  return new Decimal(amount || 0).mul(DECIMALS_MULTIPLIER);
};
