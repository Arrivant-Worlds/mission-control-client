import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import nacl from 'tweetnacl'
import { decodeUTF8 } from "tweetnacl-util";
import styles from './connect_wallet_styles.js';

export default function CONNECT_WALLET(props) {
  const { wallet, signMessage, publicKey } = useWallet();

  const getData = async (wal, sig, pkey) => {

    let now = new Date();
    // let pubkey = pkey.toString();
    let signedMsg = now.getTime().toString();
    const encodedMsg = decodeUTF8(signedMsg);
    const signature = await sig(encodedMsg);
    console.log(signature, "signed sig");
    console.log(pkey, "pubkey");
    console.log(wal, "wallet");

    // now: new Date(),
    // signedMsg: now.getTime().toString(),
    // encoder: decodeUTF8(),
    // encoded: decodeUTF8(signedMsg),
    // signature: signature,
    // parsedSignature: JSON.stringify(Array.from(signature))
    const payload = {
      signedMsg: signedMsg,
      signature: JSON.stringify(Array.from(signature)),
      pubkey: pkey._bn.words.toString()
    }

    // try {
    //   const response = await axios.post(`http://localhost:3001/users/`, {}, { headers: payload });
    //   const data = response.data;
    //   console.log(response);
    //   console.log(data);
    //   // console.log(`list of article objects`, articles);
    //   return data;
    // } catch (errors) {
    //   console.error(errors);
    // }

    props.change_body_state("bounty_main");
  };
  // console.log(wallet, "wallet");
  // console.log(signMessage, "sign_message");
  // console.log(publicKey, "public key");
  //conditional statement to change state to "connect"
    //on main page, render connected instead.
    //new state for bounty boards
    //render bounty boards
  // if (publicKey._bn.words !== undefined) {
  //   getData(wallet, signMessage, publicKey)
  // }

  return (
    <WalletMultiButton onClick={() => getData(wallet, signMessage, publicKey)}>
      CONNECT WALLET
    </WalletMultiButton>
  );
}
