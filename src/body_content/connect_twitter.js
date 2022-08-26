import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import styles from "./mission_board_styles.js";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  auth_twitter,
  get_twitter_oauth_redirect,
  verify_twitter,
} from "../api_calls/index.js";

export default function CONNECT_TWITTER(props) {
  const { publicKey, connected } = useWallet();

  const handleTwitter = async () => {
    props.handleButtonClick();

    if (publicKey && connected) {
      let header_verification = await props.getWithExpiration("verifyHeader");
      if (header_verification) {
        let headers = {
          signedMsg: header_verification.signedMsg,
          signature: header_verification.signature,
          pubkey: header_verification.pubkey,
        };
        console.log("headers", headers);
        let oauth_token = await auth_twitter(headers, publicKey.toString());
        if (oauth_token != null) {
          console.log("oauth_token ", oauth_token);
          let redirect = await get_twitter_oauth_redirect(oauth_token);
          console.log("redirect", redirect);
          window.location.href = redirect;
          await verify_twitter(headers, window.location.search);
        }
      }
    } else {
      props.handleNavigation("/connect");
    }
  };

  const handleOnHover = () => {
    props.handleButtonHover();
  };

  return (
    <Grid container justifyContent="center" sx={{ width: "100%" }}>
      <Button
        disabled={props.disabled}
        variant={props.variant}
        style={props.disabled ? {
          fontSize: "14px",
          height: "55px",
          fontWeight: "700",
          padding: "0",
          width: "100%",
          backgroundColor: "#888888",
          color: "rgba(0, 0, 0, 0.26)"
        } : props.style}
        onClick={() => handleTwitter()}
        onMouseEnter={() => handleOnHover()}
      >
        {props.buttonText}
      </Button>
    </Grid>
  );
}
