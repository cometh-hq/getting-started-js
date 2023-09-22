"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import ConnectAuth0 from "./components/ConnectAuth0";
import { useWalletAuth } from "./modules/wallet/hooks/useWalletAuth";
import ConnectWallet from "./components/ConnectWallet";
import { Transaction } from "./components/Transaction";
import Confetti from "react-confetti";
import { useWindowSize } from "./lib/ui/hooks/useWindowSize";

export default function App() {
  const { data: session, status } = useSession();
  const { isConnecting, isConnected, connect, connectionError, wallet } =
    useWalletAuth();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {transactionSuccess && (
        <Confetti width={windowWidth} height={windowHeight} />
      )}

      <div className="md:min-h-[70vh] gap-2 flex flex-col justify-center items-center">
        <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            {session ? (
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                <ConnectAuth0 session={session} status={status} />

                <ConnectWallet
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                  connect={connect}
                  connectionError={connectionError}
                  wallet={wallet}
                />
              </div>
            ) : (
              <div className="grid divide-x divide-gray-900/5 bg-gray-50">
                <ConnectAuth0 session={session} status={status} />
              </div>
            )}
            {session && isConnected && (
              <Transaction
                transactionSuccess={transactionSuccess}
                setTransactionSuccess={setTransactionSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
