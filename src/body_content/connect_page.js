import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import Button from "@mui/material/Button";
import { decodeUTF8 } from "tweetnacl-util";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import styles from "./connect_page_styles.js";
import {
  auth_twitter,
  get_twitter_oauth_redirect,
  verify_twitter,
} from "../api_calls/index.js";

export default function CONNECT_PAGE(props) {
  const { wallet, signMessage, publicKey, connect, connected } = useWallet();
  const [button_text, change_button_text] = useState("CONNECT WALLET");

  let navigate = useNavigate();
  let check_headers;

  useEffect(() => {
    // console.log("fired? in connect page");
    // console.log(!props.signed_message, "props.signed_msg");
    // console.log(wallet, "wallet");
    // console.log(connected, "connected?");

    const check_sig = async () => {
      // check_headers = await props.getWithExpiration("verifyHeader");
      if (wallet && !props.wallet_data) {
        change_button_text("SIGN MESSAGE");
      }
      // else if (wallet && connected && props.wallet_data) {
      //   //let gather_data = props.populate_data(check_headers);
      //   navigate("/bounty_main");
      // }
    };
    check_sig();
    // if (wallet && connected && !props.signed_message) {
    // } else if (wallet && connected && props.signed_message) {
    //   console.log("hittingggg??????");
    //   let payload = props.sign_message();
    //   let gather_data = props.populate_data(payload);
    //   navigate('/bounty_main');
    // }
    //check for all three props wallet, connect and sign_message
    //redirect to dashboard anyways.
    // console.log(connected, "connected");
    // // window.localStorage.setItem('signature_time', JSON.stringify(now));
    // // console.log(window.localStorage.getItem('signature_time'));
    // let now = Date.now();
    // let difference = now - window.localStorage.getItem('signature_time');
  });

  const handleClick = async () => {
    let connect_to_wallet = await connect();
    if (wallet && connected) {
      change_button_text("SIGN MESSAGE");
    }
    // props.change_body_state(state);
    // navigate(state);
  };

  const handleConnectHover = () => {
    props.handleConnectHover();
  };

  const handleSign = async () => {
    props.playConnectWallet();
    let payload = await props.sign_message();
    let gather_data = await props.populate_data(payload);
    navigate("/bounty_main");
  };

  return (
    <Grid
      container
      sx={styles.connect_container}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={1}>
        <Typography sx={styles.connect_title}>
          CONNECT YOUR CRYPTO WALLET
        </Typography>
      </Grid>
      <Grid container item xs={1} justifyContent="center" alignItems="center">
        <Typography sx={styles.connect_text}>
          YOUR BOUNTY WILL BE PLENTIFUL.
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={3}
        direction="column"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Box onMouseEnter={() => handleConnectHover()}>
          <WalletMultiButton
            className="wallet_button"
            onClick={
              connected && wallet && !check_headers
                ? () => handleSign()
                : () => handleClick()
            }
          >
            {button_text}
          </WalletMultiButton>
        </Box>
      </Grid>
    </Grid>
  );
}
