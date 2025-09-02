import {
  ConnectButton,
  useCurrentWallet,
  useDisconnectWallet,
} from '@mysten/dapp-kit';
import React from 'react';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function WalletConnect() {
  const { currentWallet } = useCurrentWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  console.log(1234, currentWallet);
  if (currentWallet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Wallet Connected</CardTitle>
          <CardDescription>
            Address: {currentWallet.accounts[0]?.address.slice(0, 8)}...
            {currentWallet.accounts[0]?.address.slice(-8)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => disconnect()}
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
}
