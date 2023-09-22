import { useContext } from "react";
import { WalletContext } from "../services/context";

export function useWalletContext() {
  const {
    wallet,
    setWallet,
    provider,
    setProvider,
    counterContract,
    setCounterContract,
  } = useContext(WalletContext);
  return {
    wallet,
    setWallet,
    provider,
    setProvider,
    counterContract,
    setCounterContract,
  };
}
