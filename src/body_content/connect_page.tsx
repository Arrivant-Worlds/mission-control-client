import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import styles from "./connect_page_styles";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Button, Dialog, DialogContent, IconButton } from "@mui/material";
import { useWeb3Wallet } from "../App";
import CloseIcon from "@mui/icons-material/Close";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SignInButton } from 'ethos-connect'



interface ConnectPageProps {
  handleConnectHover: () => void;
  loginChange: () => void;
}

export const CONNECT_PAGE = (props: ConnectPageProps) => {
  const [button_text, change_button_text] = useState("SIGN IN");
  const { login, logout, getUserInfo } = useWeb3Wallet()
  const [walletDialog, setWalletDialog] = useState(false)
  const handleLogin = async () => {
    await login()
  };

  const handleWalletLogin = async () => {
    setWalletDialog(true)
  }

  const handleConnectHover = () => {
    props.handleConnectHover();
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
          Become a citizen of a new world
        </Typography>
      </Grid>
      <Grid
        container
        xs={3}
        direction="column"
      >
        <Box onMouseEnter={() => handleConnectHover()}>
          {/* @ts-ignore */}
          <Button
            styles={styles.button}
            onClick={handleLogin}
            type="button"
            variant="outlined"
          >
            Social Sign On
          </Button>
          {/* @ts-ignore */}
          <Button
            styles={styles.button}
            onClick={handleWalletLogin}
            type="button"
            variant="outlined"
          >
            Sign in with wallet
          </Button>
        </Box>
      </Grid>
      <Dialog
        open={walletDialog}
        onClose={() => setWalletDialog(false)}
        BackdropProps={{
          style: {
            background: "rgba(26, 32, 38, 0.8)",
            zIndex: 1,
            position: 'relative',
          },
        }}
        PaperProps={{
          style: {
            background: "black",
            borderRadius: "5px",
            width: "20%",
            height: "250px",
            maxHeight: "none",
            maxWidth: "none",
          },
        }}
        sx = {{
          zIndex: 0
        }}
      >
        <DialogContent sx={{ height: "150px" }}>
          <IconButton
            aria-label="close"
            onClick={() => setWalletDialog(false)}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              color: "#6A6A6A",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WalletMultiButton />
            <SignInButton />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default memo(CONNECT_PAGE);
