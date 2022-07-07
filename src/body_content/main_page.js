import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { decodeUTF8 } from "tweetnacl-util";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import {create_user, get_user, get_quests, get_rewards, get_leaderboard} from "./../api_calls";
import CONNECT_PAGE from './connect_page.js';
// import CONNECT_WALLET from './connect_wallet.js';
import BOUNTY_PAGE from './bounty_page.js';
import MISSION_DIALOG from './mission_dialog.js';
import SNACKBAR from './snackbar.js';
import Box from '@mui/material/Box';
import { Typewriter, useTypewriter, Cursor } from 'react-simple-typewriter';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SG_logo from '../images/PE_SG_logo.png';
import black_circle from '../images/black_circle.png';
import ripple_diamond from '../images/ripple_diamond.png';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './main_page_styles.js';

export default function MAIN_PAGE(props) {
  const { wallet, signMessage, publicKey, connect, connected, disconnect } = useWallet();
  let navigate = useNavigate();
  const [body_state, change_body_state] = useState('join');
  const [wallet_data, change_wallet_data] = useState({});
  const [dialog_state, change_dialog_state] = useState(false);
  const [dialog_data, change_dialog_data] = useState({
  });
  const [user_data, change_user_data] = useState({});
  const [quests_data, change_quests_data] = useState([]);
  const [leaderboard_data, change_leaderboard_data] = useState([]);
  const [rewards_data, change_rewards_data] = useState([]);
  const [signed_message, change_signed_message] = useState(false);
  const [loading_state, change_loading_state] = useState(false);
  const [dropdown_anchor, change_dropdown_anchor] = useState(null);
  const dropdown_open = Boolean(dropdown_anchor);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  //severity: "success" | "info" | "warning" | "error" | undefined;

  //react hook function here for signing and then pass down to lower components
  useEffect(() => {
    const check_sig = async () => {
      let check_headers = await getWithExpiration("verifyHeader");
      // console.log(check_headers, "headers?");
      if (wallet && connected && check_headers) {
        change_signed_message(true);
        // console.log(signed_message, "true??");
        change_wallet_data(check_headers);
      }
    }
    check_sig();
  }, [])

  const setWithExpiration = async (key: string, value: any, ttl: number) => {
    const item = {
      value: value,
      expiry: new Date().getTime() + ttl * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiration = async (key: string) => {
    const itemStr = localStorage.getItem(key);
    // console.log(`itemStr`, itemStr);
    // if the item doesn't exist, return null
    if (itemStr === null) {
      change_signed_message(false);
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      change_signed_message(false);
      return null;
    }
    return item.value;
  };

  const sign_message = async () => {
    change_loading_state(true);
    let verifyHeader = await getWithExpiration("verifyHeader");

    if (verifyHeader == null) {
      const now = Date.now();
      const message = now.toString();
      const encodedMessage = decodeUTF8(message);
      // @ts-ignore
      let signature = await signMessage(encodedMessage);
      const pubkey = publicKey.toString();
      verifyHeader = {
        signedMsg: message,
        // @ts-ignore
        signature: JSON.stringify(Array.from(signature)),
        pubkey: pubkey,
      };
      change_signed_message(true);
      setWithExpiration("verifyHeader", verifyHeader, 3500);
    }
    change_loading_state(false);
    return verifyHeader;
  };

  const populate_data = async (payload) => {
    change_loading_state(true);
    // console.log(payload, "payload?");
    let user = get_user(payload);
    let leaderboard = get_leaderboard(payload);
    let quests = get_quests(payload);
    let rewards = get_rewards(payload);

    let userData = await user;
    // console.log(userData, "user data?");
    let leaderboardData = await leaderboard;
    let questsData = await quests;
    let rewardsData = await rewards;
    change_user_data(userData);
    change_leaderboard_data(leaderboardData);
    change_quests_data(questsData);
    change_rewards_data(rewardsData);
    change_wallet_data(payload);
    change_signed_message(true);
    change_loading_state(false);
  }

  const handleClick = async () => {
    if(wallet && connected) {
      let header_verification = await getWithExpiration("verifyHeader");
      console.log(header_verification, "return from local storage?");
      if (header_verification) {
        console.log(header_verification, "headers?");
        let gather_data = await populate_data(header_verification);
        navigate('/bounty_main');
      } else {
        navigate('/connect');
      }
    } else {
      navigate('/connect');
    }
  }

  const handleDiconnect = async () => {
    let disconnect_wallet = await disconnect();
    localStorage.removeItem('verifyHeader');
    change_signed_message(false);
    change_wallet_data({});
    navigate('/');
  }

  const handleDialogOpen = () => {
    // console.log("firing?? in main open");
    change_dialog_state(true);
  };

  const handleDialogClose = () => {
    change_dialog_state(false);
  };

  const handleDropdownOpen = (e) => {
    change_dropdown_anchor(e.currentTarget);
    // navigate('/');
  }

  const handleDropdownClose = () => {
    change_dropdown_anchor(null);
    // navigate('/');
  }

  const handleDropdown_navigate = (path) => {
    if (!wallet || !connected || !signed_message) {
      setAlertState({
        open: true,
        message: "Please connect your wallet and sign!",
        severity: "error",
      })
    }
    change_dropdown_anchor(null);
    navigate(path);
  }

  // const renderSwitch = (param) => {
  //   switch(param) {
  //     case 'connect':
  //       return (
  //         <CONNECT_PAGE body_state={body_state} change_body_state={change_body_state}/>
  //       );
  //     case 'connect_wallet':
  //       return (
  //         <CONNECT_WALLET body_state={body_state} change_body_state={change_body_state}
  //         wallet_data={wallet_data} change_wallet_data={change_wallet_data}/>
  //       );
  //     case 'bounty_main':
  //       return (
  //         <BOUNTY_PAGE body_state={body_state} change_body_state={change_body_state} handleDialogOpen={handleDialogOpen} handleDialogClose={handleDialogClose}
  //         wallet_data={wallet_data} dialog_data={dialog_data} change_dialog_data={change_dialog_data}/>
  //       );
  //     default:
  //       return (
  //         <Grid container style={styles.grid_container}
  //         direction="column"
  //         justifyContent="center" alignItems="center">
  //           <Grid item xs={4} alignItems="center" justifyContent="center">
  //             <Box style={{
  //               textTransform: "uppercase",
  //               margin: "-20px auto 0 auto",
  //               fontSize: "18px",
  //               width: "60%",
  //               color: "#F6F6F6"}}>
  //               <Typewriter
  //                 loop={1}
  //                 deleteSpeed={0}
  //                 words={['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia nisi neque, non tempor nibh tempor id. Donec libero urna, tempus eu ante quis, pellentesque bibendum ante.']}
  //                 cursor
  //                 cursorStyle='_'
  //                 typeSpeed={70}
  //                 delaySpeed={500}
  //               />
  //             </Box>
  //           </Grid>
  //           <Grid item xs={2}>
  //             <Box src={SG_logo} alt="SG Logo" style={styles.logo}/>
  //           </Grid>
  //           <Grid container item justifyContent="center" alignItems="center" xs={1}>
  //             <Box style={styles.button_container}>
  //               <Box src={ripple_diamond} alt="diamond ripple" style={styles.ripple_diamond}/>
  //               <Button variant="contained" style={styles.button} onClick={() => handleClick("connect")}>JOIN NOW</Button>
  //             </Box>
  //           </Grid>
  //         </Grid>
  //       );
  //   }
  // }

  const bounty_overlay_css = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg, #15181B -16.28%, rgba(21, 24, 27, 0) 36.97%)",
  }

  return (
    <Box style={window.location.pathname === "/bounty_main" ? bounty_overlay_css : styles.container}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{position: 'absolute', top: '40px', width: "90%"}}>
        <Box component="img" sx={{cursor: "pointer"}} src={black_circle} alt="black_circle_logo" onClick={(e) => handleDropdownOpen(e)}/>
        <Menu
          anchorEl={dropdown_anchor}
          open={dropdown_open}
          onClose={handleDropdownClose}
          PaperProps={{
            style: {
              background: "linear-gradient(180deg, rgba(0, 0, 0, 0.539) 25.01%, rgba(15, 15, 15, 0.285) 120.09%)",
              border: "0.916143px solid #6A6A6A",
              backdropFilter: "blur(36.6457px)",
            }
          }}
        >
          <MenuItem onClick={() => handleDropdown_navigate("/")}>Home</MenuItem>
          <MenuItem onClick={() => handleDropdown_navigate("/bounty_main")}>Dashboard</MenuItem>
        </Menu>
        {wallet && connected ?
          <WalletDisconnectButton className="disconnect_button" onClick={() => handleDiconnect()}/>
          : null
        }
      </Grid>
      <Routes>
        <Route index element={<Grid container style={styles.grid_container}
        direction="column"
        justifyContent="center" alignItems="center">
          <Grid item xs={4} alignItems="center" justifyContent="center">
            <Box sx={{
              textTransform: "uppercase",
              margin: "-20px auto 0 auto",
              fontSize: "18px",
              width: "60%",
              color: "#F6F6F6",
                '@media screen and (max-width: 2400px)': {
                  fontSize: "30px",
                },
                '@media screen and (max-width: 2200px)': {
                  fontSize: "28px",
                },
                '@media screen and (max-width: 2000px)': {
                  fontSize: "26px",
                },
              }}>
              <Typewriter
                loop={1}
                deleteSpeed={0}
                words={['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia nisi neque, non tempor nibh tempor id. Donec libero urna, tempus eu ante quis, pellentesque bibendum ante.']}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                delaySpeed={500}
              />
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box component="img" src={SG_logo} alt="SG Logo" sx={{
              marginTop: "-30px",
              width: "800px",
              '@media screen and (max-width: 2400px)': {
                width: "1000px",
              },
              '@media screen and (max-width: 2100px)': {
                width: "900px",
              }
            }}/>
          </Grid>
          <Grid container item justifyContent="center" alignItems="center" xs={1}>
            <Box style={styles.button_container}>
              <Box component="img" src={ripple_diamond} alt="diamond ripple" style={styles.ripple_diamond}/>
              <Button variant="contained" style={styles.button} onClick={() => handleClick()}>JOIN NOW</Button>
            </Box>
          </Grid>
        </Grid>} />
        <Route path="connect"
          element={<CONNECT_PAGE sign_message={sign_message} setWithExpiration={setWithExpiration}
          getWithExpiration={getWithExpiration} populate_data={populate_data} signed_message={signed_message}
          alertState={alertState} setAlertState={setAlertState}
          />}/>
          <Route path="bounty_main" element={<BOUNTY_PAGE handleDialogOpen={handleDialogOpen} handleDialogClose={handleDialogClose} wallet_data={wallet_data} dialog_data={dialog_data} change_dialog_data={change_dialog_data} quests_data={quests_data} change_quests_data={change_quests_data}
          user_data={user_data} change_user_data={change_user_data} leaderboard_data={leaderboard_data}
          rewards_data={rewards_data} change_rewards_data={change_rewards_data} populate_data={populate_data} getWithExpiration={getWithExpiration} alertState={alertState} setAlertState={setAlertState}
          />}/>
      </Routes>
      {loading_state ?
        <Box sx={{height: "100vh", width: "100vw", background: "rgba(26, 32, 38, 0.8)",
          opacity: "0.8", position: "absolute", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <CircularProgress />
        </Box>
        : null
      }
      <MISSION_DIALOG handleDialogClose={handleDialogClose}
        handleDialogOpen={handleDialogOpen} dialog_state={dialog_state}
        change_dialog_state={change_dialog_state}
        dialog_data={dialog_data} change_dialog_data={change_dialog_data}
        alertState={alertState} setAlertState={setAlertState} loading_state={loading_state}
        change_loading_state={change_loading_state} getWithExpiration={getWithExpiration}
        sign_message={sign_message}
        />
      <SNACKBAR alertState={alertState} setAlertState={setAlertState}/>
    </Box>
  );
}

// <Route path="connect_wallet" element={<CONNECT_WALLET
// wallet_data={wallet_data} change_wallet_data={change_wallet_data} user_data={user_data}
// change_user_data={change_user_data} quests_data={quests_data} change_quests_data={change_quests_data}
// leaderboard_data={leaderboard_data} change_leaderboard_data={change_leaderboard_data}
// rewards_data={rewards_data} change_rewards_data={change_rewards_data}
// />}/>
