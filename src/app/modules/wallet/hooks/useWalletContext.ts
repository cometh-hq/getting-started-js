import { useContext } from "react";
import { WalletContext } from "../services/context";

export function useWalletContext() {
  const {
    wallet,
    setWallet,
    connectClient,
    setConnectClient
  } = useContext(WalletContext);
  return {
    wallet,
    setWallet,
    connectClient,
    setConnectClient
  };
}
