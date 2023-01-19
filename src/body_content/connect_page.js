import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import styles from "./connect_page_styles.js";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Button } from "@mui/material";
import { useWeb3Wallet } from "../App.js";

export const CONNECT_PAGE = (props) => {
  const { wallet, signMessage, publicKey, connect, connected } = useWallet();
  const [button_text, change_button_text] = useState("SIGN IN");
  const { login, logout, getUserInfo } = useWeb3Wallet()
  const handleLogin = async () => {
    await login()
    let r = await getUserInfo()
    console.log("INFO", r)
  };
  const handleLogout = async () => {
    logout()
  }

  const handleConnectHover = () => {
    props.handleConnectHover();
  };

  useEffect(() => {
    if (connected) {
      props.handleNavigation("/bounty_main");
    }
  }, [publicKey])

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
          Become a citizen of a new world
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
          <Button
            className="wallet_button"
            onClick={handleLogin}
          >
            {button_text}
          </Button>
          <Button
            className="wallet_button"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default memo(CONNECT_PAGE);
