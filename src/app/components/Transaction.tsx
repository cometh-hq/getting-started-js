"use client";

import { Icons } from "../lib/ui/components";
import React, { useEffect, useState } from "react";
import { useWalletAuth } from "../modules/wallet/hooks/useWalletAuth";
import Alert from "../lib/ui/components/Alert";
import { PlusIcon } from "@radix-ui/react-icons";
import { encodeFunctionData } from "viem";
import countContractAbi from "../../app/modules/contract/counterABI.json";

const COUNTER_CONTRACT_ADDRESS = "0x84ADD3fa2c2463C8cF2C95aD70e4b5F602332160";

interface TransactionProps {
  transactionSuccess: boolean;
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Transaction({
  transactionSuccess,
  setTransactionSuccess,
}: TransactionProps) {
  const { wallet, connectClient } = useWalletAuth();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [transactionSended, setTransactionSended] = useState<string | null>(
    null
  );
  const [transactionResponse, setTransactionResponse] = useState<any>(null);
  const [transactionFailure, setTransactionFailure] = useState(false);
  const [nftBalance, setNftBalance] = useState<number>(0);

  function TransactionButton({
    sendTestTransaction,
    isTransactionLoading,
  }: {
    sendTestTransaction: () => Promise<void>;
    isTransactionLoading: boolean;
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
        )}{" "}
        Increment counter
      </button>
    );
  }

  useEffect(() => {
    if (wallet) {
      (async () => {
        const balance = await connectClient!.readContract({
          address: COUNTER_CONTRACT_ADDRESS,
          abi: countContractAbi,
          functionName: "counters",
          args: [wallet.getAddress()],
        });

        setNftBalance(Number(balance));
      })();
    }
  }, []);

  const sendTestTransaction = async () => {
    setTransactionSended(null);
    setTransactionResponse(null);
    setTransactionFailure(false);
    setTransactionSuccess(false);

    setIsTransactionLoading(true);
    try {
      if (!wallet) throw new Error("No wallet instance");

      const txCallData = encodeFunctionData({
        abi: countContractAbi,
        functionName: "count",
      });

      const tx = await connectClient!.sendTransaction({
        to: COUNTER_CONTRACT_ADDRESS,
        value: BigInt(0),
        data: txCallData,
      });

      setTransactionSended(tx);

      const txResponse = await connectClient!.getTransaction(tx);

      const balance = await connectClient!.readContract({
        address: COUNTER_CONTRACT_ADDRESS,
        abi: countContractAbi,
        functionName: "counters",
        args: [wallet.getAddress()],
      });

      setNftBalance(Number(balance));

      setTransactionResponse(txResponse);
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
        <div className="relative flex items-center gap-x-6 rounded-lg p-4">
          <TransactionButton
            sendTestTransaction={sendTestTransaction}
            isTransactionLoading={isTransactionLoading}
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
            url: `https://mumbai.polygonscan.com/tx/${transactionResponse?.transactionHash}`,
          }}
        />
      )}
      {transactionFailure && (
        <Alert state="error" content="Transaction Failed !" />
      )}
    </main>
  );
}
