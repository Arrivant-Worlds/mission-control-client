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
import { ethos } from 'ethos-connect'



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
            background: "rgba(255, 255, 255, 0.5)",
            zIndex: 1,
            position: 'relative',
          },
        }}
        PaperProps={{
          style: {
            background: "#f2f2f2",
            borderRadius: "5px",
            border: 'solid white',
            width: "40%",
            height: "400px",
            maxHeight: "none",
            maxWidth: "none",
            boxShadow: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        sx={{
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
          <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Typography variant="body2" sx={{ color: "black", alignSelf: "flex-start", mb: "20px" }}>
              Connect with Solana
            </Typography>
            <WalletMultiButton />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%", marginTop: "20px" }}>
            <Typography variant="body2" sx={{ color: "black", alignSelf: "flex-start", mb: "20px" }}>
              Connect with Sui
            </Typography>
            <Button onClick={ethos.showSignInModal}
            variant="contained"
            sx = {{
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontFamily: "'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              height: "48px",
              lineHeight: "48px",
              padding: "0 24px",
              textTransform: 'none',
              borderRadius: "4px",
              backgroundColor: "blue"
            }}
            >
              Select Wallet
            </Button>
          </Box>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", height: "50%" }}>
            <Typography variant="body2" sx={{ color: "gray", alignSelf: "flex-end", mb: "10px" }}>
              Select a wallet provider to connect
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default memo(CONNECT_PAGE);
