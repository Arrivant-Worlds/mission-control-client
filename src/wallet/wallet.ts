import { Connection, PublicKey, Transaction as SolanaTX } from "@solana/web3.js";
import {decodeUTF8} from "tweetnacl-util";
import { RPC_CONNECTION_URL } from "../api_calls/constants";
import {
    getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID, 
    TOKEN_PROGRAM_ID, getAccount, createAssociatedTokenAccountInstruction,
    TokenAccountNotFoundError, TokenInvalidAccountOwnerError} 
from "@solana/spl-token"
import { PayloadHeaders } from "interfaces";
import { WalletContextInterface } from "App";
import {
  Ed25519Keypair,
  JsonRpcProvider,
  MoveCallTransaction,
  RawSigner,
  Transaction,
} from '@mysten/sui.js';

export const refreshHeadersSolanaWallet = async (
  signMessage: any, 
  publicKey: any,
) => {
    const now = Date.now();
    const message = now.toString();
    const encodedMessage = decodeUTF8(message);
    let signature = await signMessage(encodedMessage);
    if(!signature) return
    const pubkey = publicKey;
    let headers: PayloadHeaders = {
        auto_approve: false,
        isLedger: false,
        signedMsg: message,
        signature: JSON.stringify(Array.from(signature)),
        pubkey: pubkey,
        Login: 'solana'
    };

    const item = {
        value: headers,
        expiry: new Date().getTime() + 3600 * 100000,
    };

    localStorage.setItem("verifyHeader", JSON.stringify(item));
    return headers
}

export const refreshHeadersSuiWallet = async (
  signAndExecuteTransaction: any,
  publicKey: any
) => {
  console.log("tx executing", publicKey)
  // const tx: MoveCallTransaction = {
  //   packageObjectId: '0x2',

  // };
  // const signature = await signAndExecuteTransaction({

  // })
  // console.log("main sig", signature)
  // if(!signature) return
  const pubkey = publicKey;
  console.log("got pubkey", pubkey)
  let headers: PayloadHeaders = {
      auto_approve: false,
      isLedger: false,
      signature: JSON.stringify(Array.from('')),
      pubkey: pubkey,
      Login: 'sui'
  };

  const item = {
      value: headers,
      expiry: new Date().getTime() + 3600 * 100000,
  };

  localStorage.setItem("verifyHeader", JSON.stringify(item));
  return headers
}

// async function signMessageSui() {
//   const suietAdapter = new SuietWalletAdapter();

//   const result = await suietAdapter.signMessage({
//     message: new TextEncoder().encode('Hello world')
//   })

//   const textDecoder = new TextDecoder()
//   console.log('signMessage success', result)
//   console.log('signMessage signature', result.signature)  // output -> Uint8Array
//   console.log('signMessage signedMessage', textDecoder.decode(result.signedMessage).toString()) // Uint8Array of your raw message

//   return result.signature
// }

export const refreshHeadersLedger = async (
  signTransaction: WalletContextInterface['signTransaction'], 
  publicKey: PublicKey,
  wallet: WalletContextInterface['wallet']
): Promise<PayloadHeaders | undefined> => {
    if(!publicKey) return
    console.log("ledger detected")
    const now = Date.now();
    const message = now.toString();
    const emptyTX = await createLedgerEmptyTX(publicKey)
    let signedTX = await signTransaction(wallet, emptyTX);
    //@ts-ignore
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
        //@ts-ignore
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
    publicKey: PublicKey,
    mint: PublicKey,
    tx: SolanaTX
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
      await getAccount(connection, associatedToken);
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
    publicKey: PublicKey,
) => {
    const emptyTX = new SolanaTX();
    const connection = new Connection(RPC_CONNECTION_URL);
    let block = await connection.getLatestBlockhash('confirmed')
    emptyTX.recentBlockhash = block.blockhash;
    emptyTX.feePayer = publicKey

    return emptyTX
}