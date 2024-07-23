import {useContext} from "react";
import {WalletContext} from "../services/context";

export function useWalletContext() {
    const {
        wallet,
        setWallet,
        signer,
        setSigner,
        auth,
        setAuth,
        counterContract,
        setCounterContract,
    } = useContext(WalletContext);
    return {
        wallet,
        setWallet,
        signer,
        setSigner,
        auth,
        setAuth,
        counterContract,
        setCounterContract,
    };
}
