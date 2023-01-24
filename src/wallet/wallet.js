import { Connection, Transaction } from "@solana/web3.js";
import {decodeUTF8} from "tweetnacl-util";
import { RPC_CONNECTION_URL } from "../api_calls/constants";
import {
    getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, getAccount, createAssociatedTokenAccountInstruction,
    TokenAccountNotFoundError, TokenInvalidAccountOwnerError} 
from "@solana/spl-token"

export const refreshHeaders = async (signMessage, publicKey) => {
    const now = Date.now();
    const message = now.toString();
    const encodedMessage = decodeUTF8(message);
    console.log("signing message")
    let signature = await signMessage();
    console.log("signed message", signature.toString())
    const pubkey = publicKey;
    let headers = {
        auto_approve: false,
        isLedger: false,
        signedMsg: message,
        signature: JSON.stringify(Array.from(signature)),
        pubkey: pubkey,
    };

    const item = {
        value: headers,
        expiry: new Date().getTime() + 3600 * 100000,
    };

    localStorage.setItem("verifyHeader", JSON.stringify(item));
    return headers
}

export const refreshHeadersLedger = async (signTransaction, publicKey) => {
    console.log("ledger detected")
    const now = Date.now();
    const message = now.toString();
    const emptyTX = await createLedgerEmptyTX(publicKey)
    let signedTX = await signTransaction(emptyTX);
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
        login: 'transaction'
    };
    const item = {
        value: headers,
        expiry: new Date().getTime() + 3600 * 1000,
    };

    localStorage.setItem("verifyHeader", JSON.stringify(item));
    return headers
}

export const getOrCreateUserAssociatedTokenAccountTX = async (
    publicKey,
    mint,
    tx
  ) => {

    const connection = new Connection(RPC_CONNECTION_URL);

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  
    try {
      await getAccount(connection, associatedToken, TOKEN_PROGRAM_ID);
    } catch (error) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        // As this isn't atomic, it's possible others can create associated accounts meanwhile.
        try {
          const transaction = tx.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              associatedToken,
              publicKey,
              mint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );
          return transaction;
        } catch (error) {
          console.log("e", error);
        }
      }
    }
  };
  

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