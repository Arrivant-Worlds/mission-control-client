import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  auth_twitter,
  get_twitter_oauth_redirect,
  verify_twitter,
} from "../api_calls/index";
import { useWeb3Wallet } from "../App";
import { MainProps } from "interfaces";

interface ConnectTwitterProps {
  getAuthHeaders: MainProps['getAuthHeaders']
  handleButtonClick: () => void;
  setAlertState: MainProps['setAlertState']
  handleNavigation: MainProps['handleNavigation']
  handleButtonHover: () => void;
  disabled: boolean;
  variant: "text" | "outlined" | "contained";
  style?: React.CSSProperties;
  buttonText: string;
}

export default function CONNECT_TWITTER(props: ConnectTwitterProps) {
  const { publicKey } = useWeb3Wallet()
  const handleTwitter = async () => {
    props.handleButtonClick();

    if (publicKey) {
      let header_verification = await props.getAuthHeaders();
      if (header_verification) {
        console.log("headers", header_verification);
        let oauth_token = await auth_twitter(header_verification, publicKey.toString());
        if (oauth_token.length !== 0) {
          console.log("oauth_token ", oauth_token);
          let redirect = await get_twitter_oauth_redirect(oauth_token);
          console.log("redirect", redirect);
          window.location.href = redirect;
          await verify_twitter(header_verification, window.location.search);
        } else {
          console.log("oauth_token is empty");
          props.setAlertState({
            open: true,
            message:
            "Twitter authentication failed!",
            severity: "error",
          });
        }
      } else {
        props.handleNavigation("/");
      }
    };
  }

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
