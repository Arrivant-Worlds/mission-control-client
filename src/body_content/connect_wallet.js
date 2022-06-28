import React from 'react';
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import {create_user} from "./../api_calls";
import { decodeUTF8 } from "tweetnacl-util";
import styles from './connect_wallet_styles.js';

export default function CONNECT_WALLET(props) {
  const { wallet, signMessage, publicKey } = useWallet();
  let navigate = useNavigate();

  const getData = async (wal, sig, pkey) => {
    if (props.wallet_data.signedMsg) {
      return;
    } else {
      let now = new Date();
      let signedMsg = now.getTime().toString();
      const encodedMsg = decodeUTF8(signedMsg);
      const signature = await sig(encodedMsg);

      const payload = {
        signedMsg: signedMsg,
        signature: JSON.stringify(Array.from(signature)),
        pubkey: publicKey.toString()
      }

      // set loading
      const user_data = await create_user(payload);
      props.change_wallet_data(payload);
      // navigate(`/bounty_main`);

      // props.change_body_state("bounty_main");
      // console.log(user_data, "user_data");
      // unset loading when user_data comes back and is set to state.
    }
  };

  const handleDisconnect = () => {
    props.change_wallet_data({});
  }

  const handleNavigate = () => {
    navigate(`/bounty_main`);
  }

  return (
    <Box style={styles.button_container}>
      {!props.wallet_data.signedMsg ?
        <WalletMultiButton onClick={() => getData(wallet, signMessage, publicKey)}>
        CONNECT WALLET
        </WalletMultiButton>
        :
        <Box style={styles.button_container}>
          <WalletDisconnectButton onClick={() => handleDisconnect()}/>
          <Button variant="contained" style={styles.button} onClick={() => handleNavigate()}>DASHBOARD</Button>
        </Box>
      }
    </Box>
  );
}
