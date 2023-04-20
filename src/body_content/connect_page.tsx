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
import white_chest from "../images/chest.png";
import suiLogo from "../images/SUI.png";
import solanaLogo from "../images/SOLANA.png";
import { useWallet } from "@solana/wallet-adapter-react";

interface ConnectPageProps {
  handleConnectHover: () => void;
  loginChange: () => void;
  isDisconnectVisible: boolean;
}

export const CONNECT_PAGE = (props: ConnectPageProps) => {
  const SolanaWallet = useWallet();
  const SuiWallet = ethos.useWallet()
  const { login } = useWeb3Wallet()
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
      {props.isDisconnectVisible ? (
        <>
          <Grid item xs={1}>
            <Typography sx={styles.connect_title}>
              YOUR WALLET IS CONNECTED
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
            spacing={2} // Add spacing between items
          >
            <Grid item> {/* Wrap each button in a Grid item */}
              <Box onMouseEnter={() => handleConnectHover()}>
                <Button>
                  Back to Dashboard
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
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
            spacing={2} // Add spacing between items
          >
            <Grid item> {/* Wrap each button in a Grid item */}
              <Box onMouseEnter={() => handleConnectHover()}>
                <Button
                  onClick={handleLogin}
                  variant="outlined"
                  sx={{
                    border: "1px solid #F6F6F6",
                    marginTop: "10px",
                  }}
                >
                  Social Sign On
                </Button>
              </Box>
            </Grid>
            <Grid item> {/* Wrap each button in a Grid item */}
              <Box onMouseEnter={() => handleConnectHover()}>
                <Button
                  onClick={handleWalletLogin}
                  variant="outlined"
                  sx={{
                    border: "1px solid #F6F6F6",
                  }}
                >
                  Sign in with wallet
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

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
            background: "#111",
            borderRadius: "10px",
            width: "400px",
            height: "550px",
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
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", height: "25%" }}>
            <Typography sx={{ width: '80%', color: "white", alignSelf: "center", mb: "5px", textAlign: 'center', fontFamily: 'Proxima Nova',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '22px',
            letterSpacing: '0.1em'
            }}>
            PLEASE CHOOSE YOUR PREFERRED WALLET
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Box sx={{ color: "#fff", alignSelf: "center", mb: "20px", fontWeight: 700, marginTop: '10%' }}>
            <img src={solanaLogo} alt='solanaLogo'></img>
          </Box>
          <WalletMultiButton className="centralConnect">{SolanaWallet.connected ? "SIGN MESSAGE" : "CONNECT WALLET"}</WalletMultiButton>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%", marginTop: "20px" }}>
          <Box sx={{ color: "#fff", alignSelf: "center", mb: "20px", fontWeight: 700, marginTop: '10%' }}>
            <img src={suiLogo} alt='suiLogo'></img>
          </Box>
          <Button
            onClick={ethos.showSignInModal}
            variant="outlined"
            sx={{
              border: '1px solid #4CA3FF',
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              width: '45%',
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '15px',
              textAlign: 'center',
              height: "48px",
              textTransform: 'none',
              borderRadius: "4px",
              backgroundColor: "none",
              "&:hover": {
                backgroundColor: "none",
              },
            }}
          >
            {SuiWallet.status === 'connected' ? "SIGN MESSAGE" : "CONNECT WALLET"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
    </Grid >
  );
}

export default memo(CONNECT_PAGE);
