"use client";
import {ComethAuth, ComethWallet, ComethWalletSigner} from "@cometh/connect-hosted-sdk";
import {ethers} from "ethers";
import {createContext, Dispatch, SetStateAction, useState} from "react";

export const WalletContext = createContext<{
    wallet: ComethWallet | null;
    setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
    signer: ComethWalletSigner | null;
    setSigner: Dispatch<SetStateAction<ComethWalletSigner | null>>;
    auth: ComethAuth | null;
    setAuth: Dispatch<SetStateAction<ComethAuth | null>>;
    counterContract: ethers.Contract | null;
    setCounterContract: Dispatch<SetStateAction<any | null>>;
}>({
    wallet: null,
    setWallet: () => {
    },
    signer: null,
    setSigner: () => {
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
    const [signer, setSigner] = useState<ComethWalletSigner | null>(null);
    const [auth, setAuth] = useState<ComethAuth | null>(null);
    const [counterContract, setCounterContract] =
        useState<ethers.Contract | null>(null);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                setWallet,
                signer,
                setSigner,
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
