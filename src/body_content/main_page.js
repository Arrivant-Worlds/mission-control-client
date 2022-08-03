import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { Connection, Transaction } from "@solana/web3.js";
import {
  get_user,
  get_quests,
  get_rewards,
  get_leaderboard,
  claim_journey_reward,
  claim_quest_reward,
  verify_twitter,
  RPC_CONNECTION, transmit_signed_quest_reward_tx_to_server,
} from "./../api_calls";
import CONNECT_PAGE from "./connect_page.js";
import BOUNTY_PAGE from "./bounty_page.js";
import MISSION_DIALOG from "./mission_dialog.js";
import REWARDS_DIALOG from "./rewards_dialog.js";
import WELCOME_DIALOG from "./welcome_dialog.js";
import LORE_PAGE from "./lore_page.js";
import SNACKBAR from "./snackbar.js";
import Box from "@mui/material/Box";
import { Routes, Route } from "react-router-dom";
import Typography from "@mui/material/Typography";
import MC_logo from "../images/MC_logo.png";
import ripple_diamond from "../images/ripple_diamond.png";
import background from "../images/MissionControl_HQ_background.jpg";
import lore_background from "../images/lore_background.jpeg";
import { Typewriter } from "react-simple-typewriter";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import styles from "./main_page_styles.js";
import navIcon from "../images/NavIcon_withshadow.png";
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
import { refreshHeaders, refreshHeadersLedger } from "../wallet/wallet";

export const MAIN_PAGE = (props) => {
  const {
    wallet,
    signMessage,
    publicKey,
    connected,
    disconnect,
    signTransaction,
  } = useWallet();
  let navigate = useNavigate();
  const [wallet_data, change_wallet_data] = useState(null);
  const [dialog_state, change_dialog_state] = useState(false);
  const [rewards_dialog_state, change_rewards_dialog_state] = useState(false);
  const [dialog_data, change_dialog_data] = useState({});
  const [user_data, change_user_data] = useState({});
  const [quests_data, change_quests_data] = useState([]);
  const [leaderboard_data, change_leaderboard_data] = useState([]);
  const [rewards_data, change_rewards_data] = useState([]);
  const [rewards_dialog_data, set_rewards_dialog_data] = useState({
    xp: "",
    id: "",
    type: "",
    type_reward: {
      type: "",
      url: "",
    },
  });
  const [loading_state, change_loading_state] = useState(false);
  const [dropdown_anchor, change_dropdown_anchor] = useState(null);
  const dropdown_open = Boolean(dropdown_anchor);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const [actionDone, setActionDone] = useState(false);
  const [welcome_popup_flag, setWelcome_popup_flag] = useState(false);
  const [claim_tutorial_flag, setClaim_tutorial_flag] = useState(false);
  const [welcome_popup, setWelcome_popup] = useState(false);

  const [volume, setVolume] = useState(1);
  // Drew's changes - sound hooks
  const [playbackRate, setPlaybackRate] = React.useState(0.7);
  const [playAurahTheme, { pause }] = useSound(AurahTheme, {
    interrupt: false,
    volume: (volume === 1 ? 0.3 : 0),
  });
  const [playQuestOpen] = useSound(QuestOpen, {
    interrupt: true,
    volume: volume,
  });
  const [playQuestClose] = useSound(QuestClose, {
    interrupt: true,
    volume: volume,
  });
  const [playQuestHover] = useSound(QuestHover, {
    interrupt: true,
    volume: volume,
  });
  const [playConnectWallet] = useSound(ConnectWallet, {
    interrupt: true,
    volume: volume,
  });
  const [playClaimPassport] = useSound(ClaimPassport, {
    interrupt: true,
    volume: volume,
  });
  const [playQuestType] = useSound(QuestType, {
    interrupt: true,
    volume: volume,
  });
  const [playMissionsTab] = useSound(MissionsTab, {
    interrupt: true,
    volume: volume,
  });
  const [playLeaderboardTab] = useSound(LeaderboardTab, {
    interrupt: true,
    volume: volume,
  });
  const [playRewardsTab] = useSound(RewardsTab, {
    interrupt: true,
    volume: volume,
  });
  const [playEggTab] = useSound(EggTab, { interrupt: true, volume: volume });
  const [playDisconnectWallet] = useSound(DisconnectWallet, {
    interrupt: true,
    volume: volume,
  });
  const [playDisconnectHover] = useSound(DisconnectHover, {
    interrupt: true,
    volume: volume,
  });
  const [playMainHover] = useSound(MainHover, {
    interrupt: true,
    playbackRate,
    volume: volume,
  });

  const [doesLedgerExist, setDoesLedgerExist] = useState(false)

  const loadUserData = async () => {
    change_loading_state(true);
    toggleOnLedger()
    await populate_data();
    change_loading_state(false);
  };

  const toggleOnLedger = () => {
    setDoesLedgerExist(true);
    localStorage.setItem("isLedger", true)
  }

  const toggleOffLedger = () => {
    setDoesLedgerExist(false);
    localStorage.setItem("isLedger", false)
  }

  useEffect(() => {
      //change this conditional to check for success in oath.
        //fire with the query parameters?/oauth_token
        //also trigger conditional for snackbar bar to show up saying twitter auth worked if url says finished?=true
    if (window.location.search) {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
      let value = params.oauth_token;
      handleLinkTwitter(window.location.search);
      setAlertState({
        open: true,
        message:
          "Twitter authentication success!",
        severity: "success",
      });
    }
    if (connected) {
      loadUserData();
    }
  }, [publicKey]);

  const backgroundImageRender = () => {
    if (window.location.pathname === "/lore") {
      return lore_background;
    } else {
      return background;
    }
  };

  const getWithExpiration = async () => {
    let key = "verifyHeader";
    let ledgerKey = "isLedger"
    const itemStr = localStorage.getItem(key);
    if (itemStr === null) {
      let data
      let ledgerExists = localStorage.getItem(ledgerKey);
      if(!ledgerExists) data = await refreshHeaders(signMessage, publicKey); 
      else if(ledgerExists) data = await refreshHeadersLedger(signTransaction, publicKey) 
      change_wallet_data(data);
      return data;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry || publicKey.toString() !== item.value.pubkey) {
      let data = await refreshHeaders(signMessage, publicKey);
      change_wallet_data(data);
      return data;
    }
    return item.value;
  };

  const populate_data = async () => {
    let header = await getWithExpiration();
    
    let userPromise = await get_user(header).then(async (user) => {
      //see what user is?
      // console.log(user, "user after get_user");
      if (user.welcome) {
        // console.log("hit in user.welcome");
      setWelcome_popup_flag(true);
      setClaim_tutorial_flag(true);
      }
      change_user_data(user);
      let leaderboardPromise = await get_leaderboard(header).then((leaderboard) =>
        change_leaderboard_data(leaderboard)
      );
      let questsPromise = await get_quests(header).then((quests) =>
        change_quests_data(quests)
      );
      let rewardsPromise = await get_rewards(header).then((rewards) =>
        change_rewards_data(rewards)
      );
    });

    await Promise.all([
      userPromise,
      // leaderboardPromise,
      // questsPromise,
      // rewardsPromise,
    ]);
  };

  const handleClick = async () => {
    playAurahTheme();
    // let header_verification = await getWithExpiration();
    // await populate_data(header_verification);
    navigate("/connect");
  };

  const handleMainHover = () => {
    playMainHover();
  };

  const handleConnectHover = () => {
    playQuestHover();
  };

  const handleDisconnect = async () => {
    playDisconnectWallet();
    let disconnect_wallet = await disconnect();
    localStorage.removeItem("verifyHeader");
    change_wallet_data(null);
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
      setAlertState({
        open: true,
        message:
          "Verification of mission can take up to 60 seconds! Come back and check the Log tab to claim your reward!",
        severity: "warning",
      });
    }
    let gather_data = await populate_data();
    setActionDone(false);
  };

  const handleRewardsOpen = (reward_id) => {
    // console.log("firing?? in main open");
    change_rewards_dialog_state(true);
  };

  const handleRewardsClose = async () => {
    change_rewards_dialog_state(false);
    change_dialog_state(false);
    let header_verification = await getWithExpiration();
    await populate_data(header_verification);
  };

  const handleWelcomeOpen = () => {
    setWelcome_popup(true);
  };

  const handleWelcomeClose = async () => {
    setWelcome_popup(false);
  };

  const handleClaimQuestReward = async (reward_id) => {
    let header_verification = await getWithExpiration();
    await claim_quest_reward(header_verification, reward_id);
    await populate_data();
  };

  const handleClaimJourneyReward = async (reward_id, type_reward) => {
    let header_verification = await getWithExpiration();
    let claim = await claim_journey_reward(header_verification, reward_id);

    if (claim.length > 0 && type_reward.type === "soulbound") {
      setAlertState({
        open: true,
        message:
          "Claiming requires .03 SOL!",
        severity: "warning",
      });
      let buffer = Buffer.from(claim, "base64");
      const tx = Transaction.from(buffer);
      const signedTX = await signTransaction(tx)
      const dehydratedTx = signedTX.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      })
      const serializedTX = dehydratedTx.toString('base64')
      await transmit_signed_quest_reward_tx_to_server(header_verification, serializedTX, reward_id)
      setAlertState({
        open: true,
        message:
          "Soulbound transactions may take up to one minute!",
        severity: "warning",
      });
    } else {
      console.log("Wrong journey reward type or claim transaction is empty");
    }

    await populate_data(header_verification);
  };

  const handleDropdownOpen = (e) => {
    change_dropdown_anchor(e.currentTarget);
    // navigate('/');
  };

  const handleDropdownClose = () => {
    change_dropdown_anchor(null);
    // navigate('/');
  };

  const handleDropdown_navigate = (path) => {
    if (path === "elune") {
      window.open("https://www.projecteluune.com");
      change_dropdown_anchor(null);
      return;
    }

    if (path === "/bounty_main") {
      if (!wallet || !connected) {
        setAlertState({
          open: true,
          message: "Please connect your wallet and sign!",
          severity: "error",
        });
        navigate("/connect");
      }
    }
    change_dropdown_anchor(null);
    navigate(path);
  };

  const handleLinkTwitter = async (query) => {
    let header_verification = await getWithExpiration("verifyHeader");
    if (!header_verification) {
      return;
    }
    let headers = {
      signedMsg: header_verification.signedMsg,
      signature: header_verification.signature,
      pubkey: header_verification.pubkey,
    };

    await verify_twitter(headers, query);
  };

  // const toggleEle = (elem, state) => {
  //   if (state) {
  //     elem.muted = !state;
  //     console.log(elem.muted, "conditional");
  //     elem.play();
  //   } else {
  //     elem.muted = !state;
  //     console.log(elem.muted, "else");
  //     elem.pause();
  //   }
  // }

  const toggle_sound = () => {
    if (volume === 1) {
      setVolume(0);
      //stops aurah theme music;
      pause();
    } else {
      setVolume(1);
      //plays aurah theme music;
      playAurahTheme();
    }
  };

  const overlay_css = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(180deg, #15181B -16.28%, rgba(21, 24, 27, 0) 36.97%)",
  };

  const lore_object = {
    height: "100vh",
    width: "100vw",
    position: "relative",
    backgroundSize: "cover",
    backgroundImage: `url(${backgroundImageRender()})`,
  };

  return (
    <Box
      sx={window.location.pathname === "/lore" ?
        lore_object
        :
        {
          position: "relative",
          minHeight: "750px",
          height: "100vh",
          width: "100vw",
          background: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)), url(${backgroundImageRender()})`,
          backgroundSize: "cover",
          backgroundPosition: "center 0",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }
      }
    >
      <Box
        style={
          window.location.pathname === "/bounty_main" ||
          window.location.pathname === "/lore"
            ? overlay_css
            : styles.container
        }
      >
        <Grid
          container
          justifyContent="space-between"
          sx={{ position: "absolute", top: "40px", width: "90%" }}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            sx={{ width: "auto" }}
          >
            <Box
              component="img"
              sx={{ cursor: "pointer", width: "80px" }}
              src={navIcon}
              alt="black_circle_logo"
              onClick={(e) => handleDropdownOpen(e)}
            />
            <Icon
              className={
                volume === 0
                  ? "fa-solid fa-volume-off"
                  : "fa-solid fa-volume-high"
              }
              onClick={() => toggle_sound()}
              sx={{ color: "#888888", cursor: "pointer" }}
            ></Icon>
          </Grid>
          <Menu
            anchorEl={dropdown_anchor}
            open={dropdown_open}
            onClose={handleDropdownClose}
            PaperProps={{
              style: {
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0.539) 25.01%, rgba(15, 15, 15, 0.285) 120.09%)",
                border: "0.916143px solid #6A6A6A",
                backdropFilter: "blur(36.6457px)",
              },
            }}
          >
            <MenuItem onClick={() => handleDropdown_navigate("elune")}>
              Project Eluüne
            </MenuItem>
            { window.location.pathname !== "/" ?
              <MenuItem onClick={() => handleDropdown_navigate("/")}>
              Home
              </MenuItem>
              : null
            }
            <MenuItem onClick={() => handleDropdown_navigate("/bounty_main")}>
            Dashboard
            </MenuItem>
            <MenuItem onClick={() => handleDropdown_navigate("/lore")}>
              Lore
            </MenuItem>
          </Menu>
          {wallet ? (
            <Box onMouseEnter={() => handleConnectHover()}>
              <WalletDisconnectButton
                className="disconnect_button"
                onClick={() => handleDisconnect()}
                onMouseEnter={() => handleDisconnectHover()}
              />
            </Box>
          ) : null}
        </Grid>
        <Routes>
          <Route
            index
            element={
              <Grid
                container
                style={styles.grid_container}
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={4} alignItems="center" justifyContent="center">
                  <Box
                    sx={{
                      textTransform: "uppercase",
                      margin: "30px auto 0 auto",
                      width: "60%",
                      color: "#F6F6F6",
                      "@media screen and (max-width: 2400px)": {
                        fontSize: "30px",
                      },
                      "@media screen and (max-width: 2200px)": {
                        fontSize: "28px",
                      },
                      "@media screen and (max-width: 2000px)": {
                        fontSize: "26px",
                      },
                    }}
                  >
                    <Typography className="lore_text" sx={{opacity: "0", fontSize:"18px"}}>A hidden world found us — and calls to us. Your time has come. To found a new nation. To brave a new frontier abound with riches, adventure, and danger. The moment has arrived to leave your mark on a better future. Will you answer the call?</Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    component="img"
                    src={MC_logo}
                    alt="SG Logo"
                    sx={{
                      marginTop: "-60px",
                      width: "300px",
                      "@media screen and (max-width: 2400px)": {
                        width: "700px",
                      },
                      "@media screen and (max-width: 2100px)": {
                        width: "600px",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  container
                  item
                  justifyContent="center"
                  alignItems="center"
                  xs={1}
                >
                  <Box style={styles.button_container}>
                    <Box
                      component="img"
                      src={ripple_diamond}
                      alt="diamond ripple"
                      style={styles.ripple_diamond}
                    />
                    <Button
                      variant="contained"
                      style={styles.button}
                      onClick={() => handleClick()}
                      onMouseEnter={() => handleMainHover()}
                    >
                      JOIN NOW
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            }
          />
          <Route
            path="connect"
            element={
              <CONNECT_PAGE
                getWithExpiration={getWithExpiration}
                populate_data={populate_data}
                alertState={alertState}
                setAlertState={setAlertState}
                handleConnectHover={handleConnectHover}
                handleDisconnectHover={handleDisconnectHover}
                playConnectWallet={playConnectWallet}
              />
            }
          />
          <Route
            path="bounty_main"
            element={
              <BOUNTY_PAGE
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
                loading_state={loading_state}
                change_loading_state={change_loading_state}
                playQuestType={playQuestType}
                playLeaderboardTab={playLeaderboardTab}
                playRewardsTab={playRewardsTab}
                playEggTab={playEggTab}
                playMissionsTab={playMissionsTab}
                handleDialogHover={handleDialogHover}
                rewards_dialog_data={rewards_dialog_data}
                set_rewards_dialog_data={set_rewards_dialog_data}
                setAlertState={setAlertState}
                welcome_popup_flag={welcome_popup_flag}
                handleWelcomeOpen={handleWelcomeOpen}
                handleMainHover={handleMainHover}
                claim_tutorial_flag={claim_tutorial_flag}
                setClaim_tutorial_flag={setClaim_tutorial_flag}
              />
            }
          />
          <Route path="lore" element={<LORE_PAGE />} />
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
          dialog_data={dialog_data}
          change_dialog_data={change_dialog_data}
          user_data = {user_data}
          actionDone={actionDone}
          setActionDone={setActionDone}
          alertState={alertState}
          setAlertState={setAlertState}
          getWithExpiration={getWithExpiration}
          handleTwitterButton={playClaimPassport}
          handleDialogHover={handleDialogHover}
          handleRewardsOpen={handleRewardsOpen}
          handleRewardsClose={handleRewardsClose}
          rewards_dialog_data={rewards_dialog_data}
          set_rewards_dialog_data={set_rewards_dialog_data}
        />
        <REWARDS_DIALOG
          rewards_dialog_state={rewards_dialog_state}
          change_rewards_dialog_state={change_rewards_dialog_state}
          handleRewardsOpen={handleRewardsOpen}
          handleRewardsClose={handleRewardsClose}
          handleClaimQuestReward={handleClaimQuestReward}
          handleClaimJourneyReward={handleClaimJourneyReward}
          rewards_dialog_data={rewards_dialog_data}
          set_rewards_dialog_data={set_rewards_dialog_data}
        />
        <WELCOME_DIALOG
          handleWelcomeClose={handleWelcomeClose}
          welcome_popup={welcome_popup}
          playQuestOpen={playQuestOpen}
        />
        <SNACKBAR alertState={alertState} setAlertState={setAlertState} />
        <Typography sx={{
          position: "absolute",
          bottom: "40px",
          fontSize: "20px",
          lineHeight: "15px",
          letterSpacing: "0.1em",
          color: "#FFFFFF",
        }}>EARLY ALPHA ACCESS</Typography>
      </Box>
    </Box>
  );
};

export default memo(MAIN_PAGE);

// //typewriter
// <Typewriter
//   loop={1}
//   deleteSpeed={0}
//   words={[
//     "A hidden world found us, and called to us. Your time has come to found a new nation—a new frontier abound with riches, adventure, and danger. The time has come to leave your mark on a better future. Will you answer the call?",
//   ]}
//   cursor
//   cursorStyle="_"
//   typeSpeed={70}
//   delaySpeed={500}
// />
