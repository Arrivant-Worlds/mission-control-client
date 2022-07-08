import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "./mission_board_styles.js";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  auth_twitter,
  get_twitter_oauth_redirect,
  verify_twitter,
} from "../api_calls/index.js";

// Melvin - todo list
// TODO: receive wallet as props ?
// TODO: create useState for twitter connection in main_page.js ?
// TODO: style/format this component as needed
// TODO: impl this component in the proper place in the client
export default function CONNECT_TWITTER(props) {
  const { publicKey } = useWallet();

  useEffect(() => {
    const verify = async () => {
      let status = await verify_twitter(window.location.search);
      console.log("verify twitter status", status);
    };
    verify();
  }, []);

  const handleTwitter = async (wallet) => {
    props.handleButtonClick();
    let oauth_token = await auth_twitter(wallet);
    if (oauth_token != null) {
      console.log("oauth_token ", oauth_token);
      let redirect = await get_twitter_oauth_redirect(oauth_token);
      console.log("redirect", redirect);
      window.location.href = redirect;
    } else {
      console.log("ERROR: failed to get twitter oauth redirect URL");
    }
  };

  const handleOnHover = () => {
    props.handleButtonHover();
  };

  return (
    <Box>
      <Button
        variant={props.variant}
        style={props.style}
        onClick={() => handleTwitter(publicKey.toString())}
        onMouseEnter={() => handleOnHover()}
      >
        Connect Twitter
      </Button>
    </Box>
  );
}
