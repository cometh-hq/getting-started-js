"use client";

import { Icons } from "../lib/ui/components";
import { TransactionReceipt } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { useWalletAuth } from "../modules/wallet/hooks/useWalletAuth";
import Alert from "../lib/ui/components/Alert";
import { PlusIcon } from "@radix-ui/react-icons";
import { 
  RelayTransactionResponse,
  ComethWallet,
  ConnectAdaptor  } from "@cometh/connect-sdk";
import { useWindowSize } from "../lib/ui/hooks/useWindowSize";
import Confetti from "react-confetti";
import { SupportedNetworks } from "@cometh/connect-sdk";

interface TransactionProps {
  transactionSuccess: boolean;
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const apiKey = process.env.NEXT_PUBLIC_COMETH_API_KEY!;
const chainId = process.env.NEXT_PUBLIC_COMETH_CHAIN as SupportedNetworks;
const baseUrl = process.env.NEXT_PUBLIC_COMETH_CONNECT_API_URL as string;

export function Transaction({
  transactionSuccess,
  setTransactionSuccess,
}: TransactionProps) {
  const { wallet, counterContract } = useWalletAuth();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [transactionSended, setTransactionSended] =
    useState<RelayTransactionResponse | null>(null);
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionReceipt | null>(null);
  const [transactionFailure, setTransactionFailure] = useState(false);
  const [nftBalance, setNftBalance] = useState<number>(0);

  function TransactionButton({
    sendTestTransaction,
    isTransactionLoading,
    label,
  }: {
    sendTestTransaction: () => Promise<void>;
    isTransactionLoading: boolean;
    label: string;
  }) {
    return (
      <button
        className="mt-1 flex h-11 py-2 px-4 gap-2 flex-none items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
        onClick={sendTestTransaction}
      >
        {isTransactionLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <PlusIcon width={16} height={16} />
          </>
        )}
        {label}
      </button>
    );
  }

  useEffect(() => {
    if (wallet) {
      (async () => {
        const balance = await counterContract!.counters(wallet.getAddress());
        setNftBalance(Number(balance));
      })();
    }
  }, []);

  const sendTestTransaction = async (action: () => Promise<void>) => {
    setTransactionSended(null);
    setTransactionResponse(null);
    setTransactionFailure(false);
    setTransactionSuccess(false);

    setIsTransactionLoading(true);
    try {
      if (!wallet) throw new Error("No wallet instance");

      await action();

      const balance = await counterContract!.counters(wallet.getAddress());
      setNftBalance(Number(balance));

      setTransactionSuccess(true);
    } catch (e) {
      console.log("Error:", e);
      setTransactionFailure(true);
    }

    setIsTransactionLoading(false);
  };

  return (
    <main>
      <div className="p-4">
        <div className="relative flex flex-col items-center gap-y-6 rounded-lg p-4">
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
                if (!wallet) throw new Error("No wallet instance");
                const response = await wallet.setupDelayModule("0x3DC29f7394Bd83fC99058e018426eB8724629fC6", 3800, 40800);
                //const response = await wallet.setUpRecovery()
     
                console.log("Setup Delay Module:", response);
              })
            }
            isTransactionLoading={isTransactionLoading}
            label="Setup Delay Module"
          />
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
              if (!wallet) throw new Error("No wallet instance");
              const response = await wallet.getDelayModuleAddressFor(3800, 40800)
              console.log("Delay Module Address:", response)
            })
            }
            isTransactionLoading={isTransactionLoading}
            label="Get Delay Module Address"
          />
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
                const walletAdaptor = new ConnectAdaptor({
                  chainId,
                  apiKey,
                  baseUrl,
                });

                if (!wallet) throw new Error("No wallet instance");
                const response = await walletAdaptor.initRecoveryRequest("0xA8eFb84C7B75837C1a2Fc4a0a81d586754b92EC8", "passkey", 3600, 84600)
                console.log("Init Recovery Request:", response)
              })
            }
            isTransactionLoading={isTransactionLoading}
            label="Init Recovery Request"
          />
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
                if (!wallet) throw new Error("No wallet instance");
                const response = await wallet.cancelRecoveryRequest("0x92AAdb75AB57876484cE30CC86e8dacABa7b6Eba")
                console.log("Cancel Recovery Request:", response)
              })
            }
            isTransactionLoading={isTransactionLoading}
            label="Cancel Recovery Request"
          />
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
                if (!wallet) throw new Error("No wallet instance");
                const response = await wallet.getCurrentRecoveryParams("0x92AAdb75AB57876484cE30CC86e8dacABa7b6Eba")
                console.log("Current Recovery Params:", response)
              })
            }
            isTransactionLoading={isTransactionLoading}
            label="Get Current Recovery Params"
          />
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
                if (!wallet) throw new Error("No wallet instance");
                const response = await wallet.getGuardianAddress("0x92AAdb75AB57876484cE30CC86e8dacABa7b6Eba")
                console.log("Guardian Address:", response)
              })
            }
            isTransactionLoading={isTransactionLoading}
            label="Get Guardian Address"
          />
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
                if (!wallet) throw new Error("No wallet instance");
                const response = await wallet.disableGuardian("0x3DC29f7394Bd83fC99058e018426eB8724629fC6", 3600, 40600)
                console.log("Guardian Address:", response)
              })
            }
            isTransactionLoading={isTransactionLoading}
            label="Disable Guardian"
          />
          <TransactionButton
            sendTestTransaction={() =>
              sendTestTransaction(async () => {
                if (!wallet) throw new Error("No wallet instance");
                const tx: RelayTransactionResponse = await counterContract!.count();
                setTransactionSended(tx);
                const txResponse = await tx.wait();
                setTransactionResponse(txResponse);
                console.log("Increment Counter:", txResponse);
              })
            }
            isTransactionLoading={isTransactionLoading}
            label="Increment Counter"
          />
          <p className=" text-gray-600">{nftBalance}</p>
        </div>
      </div>
      {transactionSended && !transactionResponse && (
        <Alert
          state="information"
          content="Transaction in progress.. (est. time 10 sec)"
        />
      )}
      {transactionSuccess && (
        <Alert
          state="success"
          content="Transaction confirmed !"
          link={{
            content: "Go see your transaction",
            url: `${process.env.NEXT_PUBLIC_SCAN_URL}tx/${transactionResponse?.transactionHash}`,
          }}
        />
      )}
      {transactionFailure && (
        <Alert state="error" content="Transaction Failed !" />
      )}
    </main>
  );
}

// Your main component
export function MainComponent() {
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const { isConnected } = useWalletAuth();

  return (
    <>
      {isConnected && (
        <Transaction
          transactionSuccess={transactionSuccess}
          setTransactionSuccess={setTransactionSuccess}
        />
      )}
    </>
  );
}
