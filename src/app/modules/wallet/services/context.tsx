"use client";
import { ComethWallet } from "@cometh/connect-sdk";
import { ComethClient } from "@cometh/connect-sdk-viem";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const WalletContext = createContext<{
  wallet: ComethWallet | null;
  setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
  connectClient: ComethClient | null;
  setConnectClient: Dispatch<SetStateAction<ComethClient | null>>;
}>({
  wallet: null,
  setWallet: () => {},
  connectClient: null,
  setConnectClient: () => {},
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [wallet, setWallet] = useState<ComethWallet | null>(null);
  const [connectClient, setConnectClient] = useState<ComethClient | null>(null);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        connectClient,
        setConnectClient,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
