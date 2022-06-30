import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import Button from '@mui/material/Button';
import { decodeUTF8 } from "tweetnacl-util";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import styles from './connect_page_styles.js';

export default function CONNECT_PAGE(props) {
  const { wallet, signMessage, publicKey, connected } = useWallet();
  const [signed_message, change_signed_message] = useState(false);
  const [button_text, change_button_text] = useState("CONNECT WALLET");
  let navigate = useNavigate();

  useEffect(() => {
    if (wallet && connected) {
      let now = Date.now();
      let difference = now - window.localStorage.getItem('signature_time');
      if (now - window.localStorage.getItem('signature_time') <= 3600000) {
        change_signed_message(true);
        navigate('bounty_main');
      } else {
        change_button_text("SIGN MESSAGE");
      }
    }
    // console.log(connected, "connected");
    // // window.localStorage.setItem('signature_time', JSON.stringify(now));
    // // console.log(window.localStorage.getItem('signature_time'));
    // let now = Date.now();
    // let difference = now - window.localStorage.getItem('signature_time');
  })

  const handleClick = (state) => {
    // props.change_body_state(state);
    navigate(state);
  }

  const handleSign = async () => {
    let payload = await props.sign_message();
    let gather_data = await props.populate_data(payload);
    navigate('bounty_main');
  }

  return (
    <Grid container sx={styles.connect_container} direction="column" justifyContent="center" alignItems="center">
      <Grid item xs={1}>
        <Typography sx={styles.connect_title}>CONNECT YOUR CRYPTO WALLET</Typography>
      </Grid>
      <Grid container item xs={1} justifyContent="center" alignItems="center">
        <Typography sx={styles.connect_text}>YOUR BOUNTY WILL BE PLENTIFUL.</Typography>
      </Grid>
      <Grid container item xs={3} direction="column" justifyContent="flex-end" alignItems="center">
        <WalletMultiButton variant="contained" sx={styles.button} onClick={connected && signed_message ? () => handleClick() : () => handleSign()}>
        {button_text}
        </WalletMultiButton>
      </Grid>
    </Grid>
  );
}
