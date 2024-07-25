"use client";

import {useState} from "react";
import {ethers} from "ethers";
import countContractAbi from "../../contract/counterABI.json";
import {ComethAuth, ComethWallet, ComethProvider} from "@cometh/connect-hosted-sdk";
import {useWalletContext} from "@/app/modules/wallet/hooks/useWalletContext";

export function useWalletAuth() {
    const {
        wallet,
        setWallet,
        auth,
        setAuth,
        provider,
        setProvider,
        counterContract,
        setCounterContract,
    } = useWalletContext();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const [connectionError, setConnectionError] = useState<string | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_COMETH_API_KEY as string;
    const connectUrl = process.env.NEXT_PUBLIC_COMETH_CONNECT_API_URL as string;
    const oidcUrl = process.env.NEXT_PUBLIC_COMETH_OIDC_API_URL as string;
    const counterContractAddress =
        process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS ||
        "0x4FbF9EE4B2AF774D4617eAb027ac2901a41a7b5F";

    function displayError(message: string) {
        setConnectionError(message);
    }

    async function connect() {
        if (!apiKey) throw new Error("no apiKey provided");
        setIsConnecting(true)
        try {
            const auth = new ComethAuth(apiKey, {
                oidcUrl,
                connectUrl
            })
            const wallet = new ComethWallet(apiKey, {
                oidcUrl,
                connectUrl
            })
            //await auth.login()
            // with final UI, should refactor to force display modal of wallet.connect if not signup
            await wallet.connect()
            const provider = new ComethProvider(wallet)
            const counterContract = new ethers.Contract(
                counterContractAddress,
                countContractAbi,
                provider.signer
            );
            setIsConnected(true);
            setAuth(auth)
            setWallet(wallet)
            setProvider(provider)
            setCounterContract(counterContract)
            console.log('setup sdks: ', wallet, auth)
        } catch (e) {
            console.error(e)
            displayError((e as Error).message);
        } finally {
            setIsConnecting(false);
        }
    }

    async function disconnect() {
        if (!auth) throw new Error("error during SDK setup")
        try {
            await auth.logout()
            setIsConnected(false);
        } catch (e) {
            displayError((e as Error).message);
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
