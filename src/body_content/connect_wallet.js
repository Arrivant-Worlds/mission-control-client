import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import {create_user} from "./../api_calls";
import nacl from 'tweetnacl'
import { decodeUTF8 } from "tweetnacl-util";
import styles from './connect_wallet_styles.js';

export default function CONNECT_WALLET(props) {
  const { wallet, signMessage, publicKey } = useWallet();

  const getData = async (wal, sig, pkey) => {
    //
    let now = new Date();
    let signedMsg = now.getTime().toString();
    const encodedMsg = decodeUTF8(signedMsg);
    const signature = await sig(encodedMsg);
    // console.log(signature, "signed sig");
    // console.log(pkey, "pubkey");
    // console.log(wal, "wallet");

    const payload = {
      signedMsg: signedMsg,
      signature: JSON.stringify(Array.from(signature)),
      pubkey: pkey._bn.words.toString()
    }

    // set loading
    const user_data = await create_user(payload);
    props.change_wallet_data(payload);
    props.change_body_state("bounty_main");
    // console.log(user_data, "user_data");
    // unset loading when user_data comes back and is set to state.
  };

  return (
    <WalletMultiButton onClick={() => getData(wallet, signMessage, publicKey)}>
      CONNECT WALLET
    </WalletMultiButton>
  );
}
