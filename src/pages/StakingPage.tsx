import { FC } from 'react';

import { ConnectWallet } from '../components/ConnectWallet';
import { StakingForm } from '../components/StakingForm/StakingForm';
import { useAccountContext } from '../providers/AccountProvider';

export const StakingPage: FC = () => {
  const { address } = useAccountContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          SUI → afSUI Staking
        </h1>

        {address ? <StakingForm /> : <ConnectWallet />}
      </div>
    </div>
  );
};
