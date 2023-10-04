import { SiweMessage } from 'siwe';
import { UserNonceType } from '../wallet';
declare const _default: {
    createMessage: (address: string, nonce: UserNonceType, chainId: number) => SiweMessage;
};
export default _default;
