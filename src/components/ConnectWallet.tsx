import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
} from '@mysten/dapp-kit';
import React, { FC, useEffect } from 'react';

import { useAccountContext } from '../providers/AccountProvider';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export const ConnectWallet: FC = () => {
  const { setAddress } = useAccountContext();
  const currentAccount = useCurrentAccount();
  const disconnectWalletMutation = useDisconnectWallet();

  useEffect(() => {
    setAddress(currentAccount?.address);
  }, [currentAccount?.address, setAddress]);

  // no need to wrap by useCallback
  const handleDisconnectClick = async () => {
    await disconnectWalletMutation.mutateAsync();
    setAddress(undefined);
  };

  if (currentAccount) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Wallet Connected</CardTitle>
          <CardDescription>
            Address: {currentAccount.address.slice(0, 8)}...
            {currentAccount.address.slice(-8)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleDisconnectClick}
            variant="outline"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Wallet</CardTitle>
        <CardDescription>
          Connect your Sui wallet to start staking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConnectButton />
      </CardContent>
    </Card>
  );
};
