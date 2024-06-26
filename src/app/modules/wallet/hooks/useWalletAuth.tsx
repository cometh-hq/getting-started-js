"use client";

import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks,
} from "@cometh/connect-sdk";
import { useState } from "react";
import { useWalletContext } from "./useWalletContext";
import { ethers } from "ethers";
import countContractAbi from "../../contract/counterABI.json";

export function useWalletAuth() {
  const {
    setWallet,
    setProvider,
    wallet,
    counterContract,
    setCounterContract,
  } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionError, setConnectionError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_COMETH_API_KEY;
  const chainId = process.env.NEXT_PUBLIC_COMETH_CHAIN as SupportedNetworks;
  const baseUrl = process.env.NEXT_PUBLIC_COMETH_CONNECT_API_URL as string;
  const counterContractAddress =
    process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS ||
    "0x4FbF9EE4B2AF774D4617eAb027ac2901a41a7b5F";

  function displayError(message: string) {
    setConnectionError(message);
  }

  async function connect() {
    if (!apiKey) throw new Error("no apiKey provided");
    setIsConnecting(true);
    try {
      const walletAdaptor = new ConnectAdaptor({
        chainId,
        apiKey,
        baseUrl,
      });

      const instance = new ComethWallet({
        authAdapter: walletAdaptor,
        apiKey,
        baseUrl,
      });

      const localStorageAddress = window.localStorage.getItem("walletAddress");

      if (localStorageAddress) {
        await instance.connect(localStorageAddress);
      } else {
        await instance.connect();
        const walletAddress = instance.getAddress();
        window.localStorage.setItem("walletAddress", walletAddress);
      }

      const instanceProvider = new ComethProvider(instance);

      const contract = new ethers.Contract(
        counterContractAddress,
        countContractAbi,
        instanceProvider.getSigner()
      );

      setCounterContract(contract);

      setIsConnected(true);
      setWallet(instance as any);
      setProvider(instanceProvider as any);
    } catch (e) {
      displayError((e as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    if (wallet) {
      try {
        await wallet!.logout();
        setIsConnected(false);
        setWallet(null);
        setProvider(null);
        setCounterContract(null);
      } catch (e) {
        displayError((e as Error).message);
      }
    }
  }
  return {
    wallet,
    counterContract,
    connect,
    disconnect,
    isConnected,
    isConnecting,
    connectionError,
    setConnectionError,
  };
}
