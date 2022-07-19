import {decodeUTF8} from "tweetnacl-util";

export const refreshHeaders = async (signMessage, publicKey) => {
    const now = Date.now();
    const message = now.toString();
    const encodedMessage = decodeUTF8(message);
    let signature = await signMessage(encodedMessage);
    const pubkey = publicKey.toString();

    let headers = {
        signedMsg: message,
        signature: JSON.stringify(Array.from(signature)),
        pubkey: pubkey,
    };

    const item = {
        value: headers,
        expiry: new Date().getTime() + 3600 * 1000,
    };

    localStorage.setItem("verifyHeader", JSON.stringify(item));
    return headers
}
