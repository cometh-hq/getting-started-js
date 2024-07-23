"use client";
import {ComethAuth, ComethProvider, ComethWallet} from "@cometh/connect-hosted-sdk";
import {ethers} from "ethers";
import {createContext, Dispatch, SetStateAction, useState} from "react";

export const WalletContext = createContext<{
    wallet: ComethWallet | null;
    setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
    provider: ComethProvider | null;
    setProvider: Dispatch<SetStateAction<ComethProvider | null>>;
    auth: ComethAuth | null;
    setAuth: Dispatch<SetStateAction<ComethAuth | null>>;
    counterContract: ethers.Contract | null;
    setCounterContract: Dispatch<SetStateAction<any | null>>;
}>({
    wallet: null,
    setWallet: () => {
    },
    provider: null,
    setProvider: () => {
    },
    auth: null,
    setAuth: () => {
    },
    counterContract: null,
    setCounterContract: () => {
    },
});

export function WalletProvider({
                                   children,
                               }: {
    children: React.ReactNode;
}): JSX.Element {
    const [wallet, setWallet] = useState<ComethWallet | null>(null);
    const [provider, setProvider] = useState<ComethProvider | null>(null);
    const [auth, setAuth] = useState<ComethAuth | null>(null);
    const [counterContract, setCounterContract] =
        useState<ethers.Contract | null>(null);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                setWallet,
                provider,
                setProvider,
                auth,
                setAuth,
                counterContract,
                setCounterContract,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
