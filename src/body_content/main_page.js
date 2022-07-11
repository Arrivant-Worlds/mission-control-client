import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { decodeUTF8 } from "tweetnacl-util";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import {
  create_user,
  get_user,
  get_quests,
  get_rewards,
  get_leaderboard,
  claim_journey_reward
} from "./../api_calls";
import CONNECT_PAGE from "./connect_page.js";
// import CONNECT_WALLET from './connect_wallet.js';
import BOUNTY_PAGE from "./bounty_page.js";
import MISSION_DIALOG from "./mission_dialog.js";
import REWARDS_DIALOG from './rewards_dialog.js';
import SNACKBAR from './snackbar.js';
import Box from "@mui/material/Box";
import { Typewriter, useTypewriter, Cursor } from "react-simple-typewriter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SG_logo from "../images/PE_SG_logo.png";
import black_circle from '../images/black_circle.png';
import ripple_diamond from "../images/ripple_diamond.png";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from "./main_page_styles.js";

import AurahTheme from "../audio/AurahTheme.mp3";
import MainHover from "../audio/MainHover.mp3";
import QuestOpen from "../audio/QuestOpen.wav";
import QuestClose from "../audio/QuestClose.wav";
import QuestHover from "../audio/QuestHover.mp3";
import DisconnectWallet from "../audio/DisconnectWallet.wav";
import ConnectWallet from "../audio/ClaimPassport.mp3";
import ClaimPassport from "../audio/ClaimPassport.mp3";
import QuestType from "../audio/QuestType.wav";
import MissionsTab from "../audio/MissionsTab.wav";
import LeaderboardTab from "../audio/LeaderboardTab.wav";
import RewardsTab from "../audio/RewardsTab.wav";
import EggTab from "../audio/EggTab.wav";
import DisconnectHover from "../audio/QuestHover.mp3";
import useSound from "use-sound";

export default function MAIN_PAGE(props) {
  const { wallet, signMessage, publicKey, connect, connected, disconnect } =
    useWallet();
  let navigate = useNavigate();
  const [body_state, change_body_state] = useState("join");
  const [wallet_data, change_wallet_data] = useState({});
  const [dialog_state, change_dialog_state] = useState(false);
  const [rewards_dialog_state, change_rewards_dialog_state] = useState(false);
  const [dialog_data, change_dialog_data] = useState({});
  const [user_data, change_user_data] = useState({});
  const [quests_data, change_quests_data] = useState([]);
  const [leaderboard_data, change_leaderboard_data] = useState([]);
  const [rewards_data, change_rewards_data] = useState([]);
  const [rewards_id_dialog, set_rewards_id_dialog] = useState("");
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
  //state for if user did the action in mission dialog
  const [actionDone, setActionDone] = useState(false);

  // Drew's changes - sound hooks
  const [playbackRate, setPlaybackRate] = React.useState(0.7);
  const [playAurahTheme] = useSound(AurahTheme, {
    interrupt: true,
    volume: 0.3,
  });
  const [playQuestOpen] = useSound(QuestOpen, { interrupt: true });
  const [playQuestClose] = useSound(QuestClose, { interrupt: true });
  const [playQuestHover] = useSound(QuestHover, { interrupt: true });
  const [playConnectWallet] = useSound(ConnectWallet, { interrupt: true });
  const [playClaimPassport] = useSound(ClaimPassport, { interrupt: true });
  const [playQuestType] = useSound(QuestType, { interrupt: true });
  const [playMissionsTab] = useSound(MissionsTab, { interrupt: true });
  const [playLeaderboardTab] = useSound(LeaderboardTab, { interrupt: true });
  const [playRewardsTab] = useSound(RewardsTab, { interrupt: true });
  const [playEggTab] = useSound(EggTab, { interrupt: true });
  const [playDisconnectWallet] = useSound(DisconnectWallet, {
    interrupt: true,
  });
  const [playDisconnectHover] = useSound(DisconnectHover, { interrupt: true });
  const [playMainHover] = useSound(MainHover, {
    interrupt: true,
    playbackRate,
  });

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

  const setWithExpiration = async (key, value, ttl) => {
    const item = {
      value: value,
      expiry: new Date().getTime() + ttl * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiration = async (key) => {
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
    let user = await get_user(payload);
    let leaderboard = await get_leaderboard(payload);
    let quests = await get_quests(payload);
    let rewards = await get_rewards(payload);

    change_user_data(user);
    change_leaderboard_data(leaderboard);
    change_quests_data(quests);
    change_rewards_data(rewards);
    change_wallet_data(payload);
    change_signed_message(true);
    change_loading_state(false);
  }

  const handleClick = async () => {
    playAurahTheme();

    if (wallet && connected) {
      let header_verification = await getWithExpiration("verifyHeader");
      if (header_verification) {
        let gather_data = await populate_data(header_verification);
        navigate("/bounty_main");
      } else {
        navigate("/connect");
      }
    } else {
      navigate("/connect");
    }
  };

  const handleMainHover = () => {
    playMainHover();
    if (playbackRate > 1.2) {
      setPlaybackRate(0.7);
    } else {
      setPlaybackRate(playbackRate + 0.1);
    }
  };

  const handleConnectHover = () => {
    playQuestHover();
  };

  const handleDisconnect = async () => {
    playDisconnectWallet();
    let disconnect_wallet = await disconnect();
    localStorage.removeItem("verifyHeader");
    change_signed_message(false);
    change_wallet_data({});
    navigate("/");
  };

  const handleDisconnectHover = () => {
    playDisconnectHover();
  };

  const handleDialogHover = () => {
    playQuestHover();
  };

  const handleDialogOpen = () => {
    playQuestOpen();
    // console.log("firing?? in main open");
    change_dialog_state(true);
  };

  const handleDialogClose = async (action_state) => {
    playQuestClose();
    change_dialog_state(false);
    if (action_state) {
      //set the alert saying it could take up to a min to verify, come back and claim.
      setAlertState(
        {
          open: true,
          message: "Verification of mission object can take up to 60 seconds! Come back to claim your reward",
          severity: "success",
        }
      )
    }
    let header_verification = await getWithExpiration("verifyHeader");
    if (header_verification) {
      let gather_data = await populate_data(header_verification);
    } else {
      let get_signature = await sign_message();
      let gather_data = await populate_data(get_signature);
    }
    setActionDone(false);
  };

  const handleRewardsOpen = (reward_id) => {
    // console.log("firing?? in main open");
    change_rewards_dialog_state(true);
  };

  const handleRewardsClose = async () => {
    change_rewards_dialog_state(false);
    change_dialog_state(false);
    let header_verification = await getWithExpiration("verifyHeader");
    if (header_verification) {
      let gather_data = await populate_data(header_verification);
    } else {
      let get_signature = await sign_message();
      let gather_data = await populate_data(get_signature);
    }
  };

  const handleClaimQuestReward = async (reward_id) => {
    //to be implemented.
  }

  const handleClaimJourneyReward = async (reward_id) => {
    //loading
    // props.change_loading_state(true);
    let header_verification = await getWithExpiration("verifyHeader");
    if (header_verification) {
      let claim = await claim_journey_reward(header_verification, reward_id);
      //do get request for user data update.
      let retrieve_user = await populate_data(header_verification);
      // props.handleRewardsOpen(true);
      //render rewards pop up for post claiming.
    } else {
      let sign_request = await sign_message();
      // setFormSubmission(true);
      let claim = await claim_journey_reward(header_verification, reward_id);
      let retrieve_user = await populate_data(header_verification);
      // props.handleRewardsOpen(true);
    }
  }

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
    background:
      "linear-gradient(180deg, #15181B -16.28%, rgba(21, 24, 27, 0) 36.97%)",
  };

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
          <Box onMouseEnter={() => handleConnectHover()}>
            <WalletDisconnectButton className="disconnect_button"
            onClick={() => handleDisconnect()}
            onMouseEnter={() => handleDisconnectHover()}/>
          </Box>
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
              <Button variant="contained" style={styles.button} onClick={() => handleClick()}
                onMouseEnter={() => handleMainHover()}
              >JOIN NOW</Button>
            </Box>
          </Grid>
        </Grid>} />
        <Route path="connect"
          element={<CONNECT_PAGE sign_message={sign_message} setWithExpiration={setWithExpiration}
          getWithExpiration={getWithExpiration} populate_data={populate_data} signed_message={signed_message}
          alertState={alertState} setAlertState={setAlertState} handleConnectHover={handleConnectHover}
          handleDisconnectHover={handleDisconnectHover}
          playConnectWallet={playConnectWallet}
          />}/>
          <Route path="bounty_main" element={<BOUNTY_PAGE
            handleDialogOpen={handleDialogOpen}
            handleDialogClose={handleDialogClose}
            wallet_data={wallet_data}
            dialog_data={dialog_data}
            change_dialog_data={change_dialog_data}
            quests_data={quests_data}
            change_quests_data={change_quests_data}
            user_data={user_data}
            change_user_data={change_user_data}
            leaderboard_data={leaderboard_data}
            rewards_data={rewards_data}
            change_rewards_data={change_rewards_data}
            populate_data={populate_data}
            getWithExpiration={getWithExpiration}
            alertState={alertState}
            setAlertState={setAlertState}
            handleRewardsOpen={handleRewardsOpen}
            handleRewardsClose={handleRewardsClose}
            sign_message={sign_message}
            loading_state={loading_state}
            change_loading_state={change_loading_state}
            playQuestType={playQuestType}
            playLeaderboardTab={playLeaderboardTab}
            playRewardsTab={playRewardsTab}
            playEggTab={playEggTab}
            playMissionsTab={playMissionsTab}
            handleDialogOpen={handleDialogOpen}
            handleDialogClose={handleDialogClose}
            handleDialogHover={handleDialogHover}
            rewards_id_dialog={rewards_id_dialog}
            set_rewards_id_dialog={set_rewards_id_dialog}
          />}/>
      </Routes>
      {loading_state ? (
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            background: "rgba(26, 32, 38, 0.8)",
            opacity: "0.8",
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
      <MISSION_DIALOG
        handleDialogClose={handleDialogClose}
        handleDialogOpen={handleDialogOpen}
        dialog_state={dialog_state}
        change_dialog_state={change_dialog_state}
        dialog_data={dialog_data} change_dialog_data={change_dialog_data}
        actionDone={actionDone} setActionDone={setActionDone}
        alertState={alertState} setAlertState={setAlertState} getWithExpiration={getWithExpiration}
        sign_message={sign_message} handleTwitterButton={playClaimPassport} handleDialogHover={handleDialogHover}
        handleRewardsOpen={handleRewardsOpen} handleRewardsClose={handleRewardsClose}
        rewards_id_dialog={rewards_id_dialog}
        set_rewards_id_dialog={set_rewards_id_dialog}
        />
      <REWARDS_DIALOG
        rewards_dialog_state={rewards_dialog_state}
        change_rewards_dialog_state={change_rewards_dialog_state}
        handleRewardsOpen={handleRewardsOpen}
        handleRewardsClose={handleRewardsClose}
        handleClaimJourneyReward={handleClaimJourneyReward}
        rewards_id_dialog={rewards_id_dialog}
        set_rewards_id_dialog={set_rewards_id_dialog}
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
