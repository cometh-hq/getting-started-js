"use client";

import {
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks,
} from "@cometh/connect-sdk";
import { useState } from "react";
import { useWalletContext } from "./useWalletContext";
import { getConnectViemClient } from "@cometh/connect-sdk-viem";

export function useWalletAuth() {
  const { setWallet, connectClient, setConnectClient, wallet } =
    useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionError, setConnectionError] = useState<string | null>(null);

  const apiKey = "22ee7189-1ea7-4fc0-ba86-5df148509008";
  const baseUrl = "http://127.0.0.1:8000/connect";

  function displayError(message: string) {
    setConnectionError(message);
  }

  async function connect() {
    if (!apiKey) throw new Error("no apiKey provided");
    setIsConnecting(true);
    try {
      const walletAdaptor = new ConnectAdaptor({
        chainId: SupportedNetworks.POLYGON,
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
        const walletAddress = await instance.getAddress();
        window.localStorage.setItem("walletAddress", walletAddress);
      }

      const viemClient = await getConnectViemClient(instance!);

      setConnectClient(viemClient);

      setIsConnected(true);
      setWallet(instance as any);
    } catch (e) {
      console.log(e);
      displayError((e as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  return {
    wallet,
    connectClient,
    connect,
    isConnected,
    isConnecting,
    connectionError,
    setConnectionError,
  };
}
