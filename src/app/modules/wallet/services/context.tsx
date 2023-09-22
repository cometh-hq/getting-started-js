"use client";
import { ComethProvider, ComethWallet } from "@cometh/connect-sdk";
import { ethers } from "ethers";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const WalletContext = createContext<{
  wallet: ComethWallet | null;
  setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
  provider: ComethProvider | null;
  setProvider: Dispatch<SetStateAction<ComethProvider | null>>;
  counterContract: ethers.Contract | null;
  setCounterContract: Dispatch<SetStateAction<any | null>>;
}>({
  wallet: null,
  setWallet: () => {},
  provider: null,
  setProvider: () => {},
  counterContract: null,
  setCounterContract: () => {},
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [wallet, setWallet] = useState<ComethWallet | null>(null);
  const [provider, setProvider] = useState<ComethProvider | null>(null);
  const [counterContract, setCounterContract] =
    useState<ethers.Contract | null>(null);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        provider,
        setProvider,
        counterContract,
        setCounterContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
