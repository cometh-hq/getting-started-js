import {useContext} from "react";
import {WalletContext} from "../services/context";

export function useWalletContext() {
    const {
        wallet,
        setWallet,
        provider,
        setProvider,
        auth,
        setAuth,
        counterContract,
        setCounterContract,
    } = useContext(WalletContext);
    return {
        wallet,
        setWallet,
        provider,
        setProvider,
        auth,
        setAuth,
        counterContract,
        setCounterContract,
    };
}
