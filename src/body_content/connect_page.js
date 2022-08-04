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

export const CONNECT_PAGE = (props) => {
  const { wallet, signMessage, publicKey, connect, connected } = useWallet();
  const [button_text, change_button_text] = useState("CONNECT WALLET");

  let navigate = useNavigate();

  const handleClick = async () => {
    await connect();
    props.check_ledger();
  };

  const handleConnectHover = () => {
    props.handleConnectHover();
  };

  useEffect(() => {
    if (connected) {
      navigate("/bounty_main");
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
          <WalletMultiButton
            className="wallet_button"
            onClick={handleClick}
          >
            {button_text}
          </WalletMultiButton>
        </Box>
      </Grid>
    </Grid>
  );
}

export default memo(CONNECT_PAGE);
