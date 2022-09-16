import { Connection, Transaction } from "@solana/web3.js";
import {decodeUTF8} from "tweetnacl-util";
import { bloctoSDK } from "../api_calls/blocto";
import { RPC_CONNECTION_URL } from "../api_calls/constants";

export const refreshHeaders = async (signMessage, publicKey) => {
    const now = Date.now();
    const message = now.toString();
    const encodedMessage = decodeUTF8(message);
    let signature = await signMessage(encodedMessage);
    const pubkey = publicKey.toString();
    let headers = {
        auto_approve: false,
        isLedger: false,
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

export const refreshHeadersLedger = async (signTransaction, publicKey) => {
    console.log("ledger detected")
    const now = Date.now();
    const message = now.toString();
    const emptyTX = await createLedgerEmptyTX(publicKey)
    console.log("func" ,signTransaction)
    console.log("tx" ,emptyTX)
    let signedTX = await bloctoSDK.solana.request({
        method: 'convertToProgramWalletTransaction',
        params: {
          message: emptyTX.serializeMessage().toString('hex')
        }
      });
    console.log("tx?", signedTX)
    const dehydratedTx = signedTX.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      })
    const serializedTX = dehydratedTx.toString('base64')
    const pubkey = publicKey.toString();
    let headers = {
        auto_approve: true,
        isLedger: true,
        transaction: serializedTX,
        signedMsg: message,
        signature: JSON.stringify(Array.from(signedTX.signature)),
        pubkey: pubkey,
    };
    const item = {
        value: headers,
        expiry: new Date().getTime() + 3600 * 1000,
    };

    localStorage.setItem("verifyHeader", JSON.stringify(item));
    return headers
}


export const createLedgerEmptyTX = async (
    publicKey,
) => {
    const emptyTX = new Transaction();
    const connection = new Connection(RPC_CONNECTION_URL);
    let commitment = "confirmed";
    let block = await connection.getLatestBlockhash(commitment)
    emptyTX.recentBlockhash = block.blockhash;
    emptyTX.feePayer = publicKey

    return emptyTX
}