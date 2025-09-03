import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { KEEP_WALLET_ADDRESS } from '../lib/constants';
import { fn } from '../utils/fn';

export interface AccountContextProps {
  address?: string;
  setAddress: Dispatch<SetStateAction<AccountContextProps['address']>>;
}

export const AccountContext = createContext<AccountContextProps>({
  address: undefined,
  setAddress: fn,
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [address, setAddress] = useState<AccountContextProps['address']>(
    localStorage.getItem('address') ?? undefined
  );

  useEffect(() => {
    if (!KEEP_WALLET_ADDRESS) {
      localStorage.removeItem('address');
      return;
    }

    if (address) {
      localStorage.setItem('address', address);
    } else {
      localStorage.removeItem('address');
    }
  }, [address]);

  return (
    <AccountContext.Provider
      value={{
        address,
        setAddress,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);
