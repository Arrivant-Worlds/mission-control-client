import React, { useState, useEffect, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  get_user,
  get_quests,
  get_rewards,
  get_leaderboard,
  claim_journey_reward,
  claim_quest_reward,
  verify_twitter,
  RPC_CONNECTION, transmit_signed_quest_reward_tx_to_server, transmit_signed_journey_reward_tx_to_server, sleep, update_wallet, claim_all_quest_rewards, verify_discord,
} from "../api_calls";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnalytics } from '../mixpanel';
import CONNECT_PAGE from "./connect_page";
import BOUNTY_PAGE from "./bounty_page";
import MISSION_DIALOG from "./mission_dialog";
import REWARDS_DIALOG from "./rewards_dialog";
import WELCOME_DIALOG from "./welcome_dialog";
import MESSAGE_DIALOG from "./message_dialog";
import LORE_PAGE from "./lore_page";
import ADMIN_PAGE from "./admin_page";
import SNACKBAR from "./snackbar";
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
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styles from "./main_page_styles";
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
import RewardFanfare from "../audio/RewardFanfare.wav";
import useSound from "use-sound";
import { getOrCreateUserAssociatedTokenAccountTX, refreshHeaders, refreshHeadersLedger } from "../wallet/wallet";
import { RPC_CONNECTION_URL, PRELUDE_URL } from "../api_calls/constants";
import { useWeb3Wallet } from "../App";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import { decodeUTF8 } from "tweetnacl-util";
import WalletWidget from "./wallet_widget";
import { AlertState, DialogData, JourneyRewardResponseDTO, LeaderboardResponse, MessageDialog, PayloadHeaders, QuestResponse, questResponseDTO, RewardsDialogData, RewardTypes, TwitterSearchParams, userResponseDTO } from "interfaces";

export const MAIN_PAGE = () => {
  const {
    provider,
    signMessage,
    wallet,
    signTransaction,
    sendTransaction,
    authenticateUser,
    publicKey,
    getPrivateKey,
    getUserInfo,
    login,
    getBalance,
    logout
  } = useWeb3Wallet()
  const SolanaWallet = useWallet()
  let navigate = useNavigate();
  const { track, setPropertyIfNotExists } = useAnalytics();
  const [dialog_state, change_dialog_state] = useState(false);
  const [message_dialog, set_message_dialog] = useState<MessageDialog>({
    open: false,
  });
  const [rewards_dialog_state, change_rewards_dialog_state] = useState(false);
  const [dialog_data, change_dialog_data] = useState<DialogData>();
  let [user_data, change_user_data] = useState<userResponseDTO>();
  const [quests_data, change_quests_data] = useState<questResponseDTO[]>([]);
  const [leaderboard_data, change_leaderboard_data] = useState<LeaderboardResponse>();
  const [rewards_data, change_rewards_data] = useState<JourneyRewardResponseDTO[]>();
  const [clicked_state, set_clicked_state] = useState(false);
  const [rewards_dialog_data, set_rewards_dialog_data] = useState<RewardsDialogData>();
  const [loading_state, change_loading_state] = useState(false);
  const [dropdown_anchor, change_dropdown_anchor] = useState(null);
  const dropdown_open = Boolean(dropdown_anchor);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [actionDone, setActionDone] = useState(false);
  const [welcome_popup_flag, setWelcome_popup_flag] = useState(false);
  const [claim_tutorial_flag, setClaim_tutorial_flag] = useState(false);
  const [welcome_popup, setWelcome_popup] = useState(false);
  const [ledger_state, set_ledger_state] = useState(false);

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
  const [playRewardFanfare] = useSound(RewardFanfare, {
    interrupt: true,
    volume: volume,
  });
  const [playMainHover] = useSound(MainHover, {
    interrupt: true,
    playbackRate,
    volume: volume,
  });

  const loadUserData = async () => {
    try {
      change_loading_state(true);
      await populate_data();
      change_loading_state(false);
    } catch (err) {
      change_loading_state(false);
    }
  };

  const toggle_ledger_switch = () => {
    set_ledger_state(!ledger_state);
  };

  const check_ledger = () => {
    let ledgerState = JSON.parse(localStorage.getItem("verifyHeader") || "{}");
    console.log("Ledger state", ledgerState)
    if (
      wallet && (
        ledger_state ||
        ledgerState?.value?.isLedger
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleLinkDiscord = async (token_type: string, access_token: string) => {
    let header_verification = await getAuthHeaders();
    if (!header_verification) return;
    await verify_discord(
      header_verification,
      token_type,
      access_token
    );
  }

  useEffect(() => {
    //change this conditional to check for success in oath.
    //also trigger conditional for snackbar bar to show up saying twitter auth worked if url says finished?=true
    if (window.location.search) {
      const params: TwitterSearchParams = new Proxy(new URLSearchParams(window.location.search), {
        //@ts-ignore
        get: (searchParams, prop) => searchParams.get(prop),
      });
      if (params.oauth_token) {
        // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
        handleLinkTwitter(window.location.search);
        setAlertState({
          open: true,
          message:
            "Twitter authentication success!",
          severity: "success",
        });
      }
    } else if(window.location.hash) {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      console.log("entered frag", fragment)
      const [tokenType, accessToken] = [fragment.get('token_type'), fragment.get('access_token')];
      let discordAccessToken = tokenType && accessToken
      if (discordAccessToken) {
        console.log("LINKING")
        //@ts-ignore
        handleLinkDiscord(tokenType, accessToken)
        setAlertState({
          open: true,
          message:
            "Discord authentication success!",
          severity: "success",
        });
      }
    }
    async function load() {
      if (provider && wallet) {
        console.log("got wallet", wallet)
        await loadUserData()
      } else {
        if(!window.location.hash){
          handleNavigation("/");
        }
      }
    }
    load();
  }, [provider, wallet]);

  useEffect(()=>{
    if (quests_data && user_data) {
      console.log("I GOT", quests_data, user_data)
      handleNavigation("/bounty_main");
      let allActiveQuestRewards = quests_data.filter((i) => i.active_reward!.length > 0)
      if (allActiveQuestRewards.length > 0) {
        setAlertState({
          open: true,
          message: "You have xp ready to be claimed in LOG",
          severity: "info",
        })
      }
    }
  },[quests_data, user_data])


  const backgroundImageRender = () => {
    if (window.location.pathname === "/lore") {
      return lore_background;
    } else {
      return background;
    }
  };

  const authUserStandard = async (
    address: any
  ) => {
    console.log("authenticating token")
    const token = await authenticateUser();
    console.log("token?", token)
    if(!token) return
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Pubkey: address,
      Login: 'external'
    }
    const item = {
      value: headers,
      expiry: new Date().getTime() + 3600 * 1000,
    };
    console.log("got token", token)
    localStorage.setItem("verifyHeader", JSON.stringify(item));
    return headers
  }

  const getAuthHeaders = async (): Promise<PayloadHeaders | undefined> => {
    try{
      let u = await getUserInfo()
      if (!wallet || !u) return
      let headers: PayloadHeaders | undefined = {
        "Content-Type": "application/json",
      }
      //if user is using external wallet, use wallet pkey for auth
      if (Object.entries(u).length === 0) {
        const address = (await wallet.requestAccounts())[0];
        console.log("got address", address)
        //if ledger do literally fucking everything
        let isLedger = check_ledger()
        let key = "verifyHeader";
        const itemStr = localStorage.getItem(key);
        console.log("is ledger", isLedger)
        console.log("item str?", itemStr)
          if (isLedger) {
            headers = await refreshHeadersLedger(signTransaction, new PublicKey(address), wallet)
            return headers
          } else {
            headers = (await authUserStandard(address)) as PayloadHeaders
            return headers
          }
      }
  
      //if user is using SSO use it for auth
      const app_scoped_privkey = await getPrivateKey() as string
      const ed25519Key = getED25519Key(Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex"));
      const app_pub_key = ed25519Key.pk.toString("hex");
      const token = await authenticateUser();
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Pubkey: app_pub_key,
        Login: 'sso'
      }
      return headers
    } catch(err){
      logout()
    }
    
  }

  const populate_data = async () => {
    // let isLedger = check_ledger()
    // set_ledger_state(isLedger);
    let payload = await getAuthHeaders();
    if (!payload) return null
    console.log("payload", payload)
    try {
      console.log("getting user", payload)
      let user = await get_user(payload)

      if (user.welcome) {
        // console.log("hit in user.welcome");
        setWelcome_popup_flag(true);
        setClaim_tutorial_flag(true);
      }
      try {
        if (user.discord_name) {
          setPropertyIfNotExists("discord_name", user.discord_name);
          setPropertyIfNotExists("$name", user.discord_name);
        }
        if (user.twitter_id) {
          setPropertyIfNotExists("twitter_id", user.twitter_id);
        }
        if (user.email) {
          setPropertyIfNotExists("$email", user.email);
        }
      } catch (err) {
        console.log("mixpanel discord/twitter insert err", err)
      }

      if (user) {
        let leaderboard = await get_leaderboard(payload)
        if (!leaderboard) return;
        change_leaderboard_data(leaderboard)
        let quests = await get_quests(payload)
        if (!quests) return;
        change_quests_data(quests.active)
        let rewards = await get_rewards(payload)
        change_rewards_data(rewards)
      }
      change_user_data(user);
      console.log("user data", user_data)
      change_loading_state(false);
    } catch (err: { message: string } | unknown) {
      console.log(err)
      console.log("err in get user");
      //@ts-ignore
      handleMessageOpen(err.message)
      return null
    }
  };

  const handleClick = async () => {
    playAurahTheme();
    //run login modal
    await login()
  };

  const handleMainHover = () => {
    playMainHover();
  };

  const handleConnectHover = () => {
    playQuestHover();
  };

  const handleDisconnect = async () => {
    playDisconnectWallet();
    try {
      await logout()
      if (SolanaWallet.connected) {
        await SolanaWallet.disconnect()
      }
    } catch (err) {
      console.log(err)
    }
    localStorage.removeItem("verifyHeader");
    handleNavigation("/");
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

  const handleDialogClose = async () => {
    playQuestClose();
    change_dialog_state(false);
    //set the alert saying it could take up to a min to verify, come back and claim.

    await populate_data();
    setActionDone(false);
  };

  const handleRewardsOpen = () => {
    // console.log("firing?? in main open");
    change_rewards_dialog_state(true);
  };

  const handleRewardsClose = async () => {
    change_rewards_dialog_state(false);
    change_dialog_state(false);
  };

  const handleWelcomeOpen = () => {
    setWelcome_popup(true);
  };

  const handleWelcomeClose = async () => {
    setWelcome_popup(false);
  };

  const handleMessageOpen = (text: string) => {
    change_dialog_state(false);
    change_rewards_dialog_state(false);
    set_clicked_state(false);
    set_message_dialog({
      open: true,
      text: text
    });
  };

  const handleMessageClose = async () => {
    set_message_dialog({
      open: false,
    });
  };
  const handleClaimAllQRewards = async (
  ) => {
    let header_verification = await getAuthHeaders();
    if (!header_verification) return;
    let questsDataWithRewards = quests_data.filter((a) => {
      return a.active_reward.length > 0
    });
    let allFlattened: questResponseDTO['active_reward'] = [];
    questsDataWithRewards.forEach((a) => {
      allFlattened = allFlattened.concat(a.active_reward);
    });
    let rewardIDs = allFlattened.map((a) => a.id);
    let res = await claim_all_quest_rewards(
      header_verification,
      rewardIDs
    );
    if (res.status === 200) {
      setAlertState({
        open: true,
        message: "Rewards claimed",
        severity: "info",
      })
    } else {
      if (res.data) {
        setAlertState({
          open: true,
          message: res.data,
          severity: "error",
        })
      }
    }

    await populate_data();

  }
  const handleClaimQuestReward = async (reward_id: string, type_reward: RewardTypes) => {
    let header_verification = await getAuthHeaders();
    if (!header_verification) return;
    if (type_reward === RewardTypes.claim_caught_creature_reward) {
      let balance_check = await getBalance();
      let u = await getUserInfo()
      if (!u) return
      if (Object.entries(u).length !== 0 && balance_check) {
        //user is using a web wallet
        if (balance_check / LAMPORTS_PER_SOL < .01) {
          handleMessageOpen(`Please connect with your a crypto wallet to claim`);
          return;
        }
      } else {
        //user is using an external crypto wallet
        if (balance_check! / LAMPORTS_PER_SOL < .01) {
          handleMessageOpen("You must have more than .01 SOL in your wallet!");
          return;
        }
      }

    }
    let response = await claim_quest_reward(header_verification, reward_id);
    if (response.status !== 200) {
      setAlertState({
        open: true,
        message:
          response.data,
        severity: "error",
      });
    }
    if (response.data && type_reward === RewardTypes.claim_caught_creature_reward) {
      let buffer = Buffer.from(response.data, "base64");
      let signedTX;
      try {
        const tx = Transaction.from(buffer);
        signedTX = await signTransaction(wallet, tx);
      } catch (e) {
        //@ts-ignore
        if (e.message === "User rejected the request.") {
          handleMessageOpen("You must approve the transaction in order to claim!");
        }
      }

      if (signedTX) {
        //@ts-ignore
        const dehydratedTx = signedTX.serialize({
          requireAllSignatures: false,
          verifySignatures: false
        })
        const serializedTX = dehydratedTx.toString('base64')
        await transmit_signed_quest_reward_tx_to_server(header_verification, serializedTX, reward_id)
      } else {
        await transmit_signed_quest_reward_tx_to_server(header_verification, reward_id)
      }
      setAlertState({
        open: true,
        message:
          "Creature claim transactions may take up to one minute!",
        severity: "warning",
      });
    }
    await populate_data();
  };

  const handleClaimJourneyReward = async (
    reward_id: string,
    reward: RewardsDialogData
  ) => {
    if (!publicKey) return
    const userKey = new PublicKey(publicKey);
    let header_verification = await getAuthHeaders();
    console.log("THE MAIN", reward)
    if (reward.type_reward.type === "soulbound" || reward.type_reward.type === "trait_pack") {
      let balance_check = await getBalance();
      let u = await getUserInfo()
      console.log("got s", u)
      if (!u) return
      if (Object.entries(u).length !== 0) {
        //user is using a web wallet
        handleMessageOpen(`Please connect with your a crypto wallet to claim`);
        return
      } else {
        //user is using an external crypto wallet
        if (balance_check! / LAMPORTS_PER_SOL < .01) {
          handleMessageOpen("You must have more than .01 SOL in your wallet!");
          return;
        }
      }
    }
    if (reward.type_reward.type === "trait_pack") {
      let connection = new Connection(RPC_CONNECTION_URL)
      //create associated token acc for user
      let tx = new Transaction()
      await getOrCreateUserAssociatedTokenAccountTX(
        userKey,
        new PublicKey(reward.mint),
        tx
      )
      console.log("IM IN")
      set_message_dialog({
        open: true,
        text: 'Claiming requires .03 SOL'
      });

      let block = await connection.getLatestBlockhash('confirmed')
      tx.recentBlockhash = block.blockhash;
      tx.feePayer = userKey;
      let sig = await sendTransaction(wallet, tx);
      set_message_dialog({
        open: true,
        text: 'Confirming transaction...'
      });
      await sleep(3000)
      set_message_dialog({
        open: false,
      })
      console.log(sig)
    }
    if (!header_verification) return
    let claim = await claim_journey_reward(header_verification, reward_id);
    if (claim.data && reward.type_reward.type === "soulbound") {
      setAlertState({
        open: true,
        message:
          "Claiming requires .03 SOL!",
        severity: "warning",
      });
      let buffer = Buffer.from(claim.data, "base64");
      console.log("HAVE CLAIM DATA", claim.data)
      let signedTX;
      try {
        const tx = Transaction.from(buffer);
        console.log("created teX", tx)
        signedTX = await signTransaction(wallet, tx);
        console.log(signedTX, "?");
        //@ts-ignore
        const dehydratedTx = signedTX.serialize({
          requireAllSignatures: false,
          verifySignatures: false
        })
        const serializedTX = dehydratedTx.toString('base64')
        await transmit_signed_journey_reward_tx_to_server(header_verification, serializedTX, reward_id)
        setAlertState({
          open: true,
          message:
            "Nft transactions may take up to one minute!",
          severity: "warning",
        });
      } catch (e: any) {
        if (e.message === "User rejected the request.") {
          handleMessageOpen("You must approve the transaction in order to claim!");
        }
      }
    }
    else {
      console.log("claim", claim.data.message)
      if (claim.data.message) {
        handleMessageOpen(claim.data.message);
      }
      console.log("Wrong journey reward type or claim transaction is empty");
    }
    await populate_data()
    setTimeout(() => {
      populate_data()
    }, 15000)
    return claim
  };


  const handleDropdownOpen = (e: any) => {
    change_dropdown_anchor(e.currentTarget);
    // navigate('/');
  };

  const handleDropdownClose = () => {
    change_dropdown_anchor(null);
    // navigate('/');
  };

  const handleNavigation = (path: string) => {
    if (window.location.search) {
      navigate({
        pathname: path,
        search: `${window.location.search}`,
      });
      return;
    } else {
      navigate(path);
    }
  }

  const handleDropdown_navigate = (path: string) => {
    if (path === "lore") {
      track('Lore Drop-Down Menu Click', {
        event_category: 'Button Click',
        event_label: "Lore Drop-Down Menu Click",
      })
      return;
    }
    if (path === "elune") {
      window.open("https://www.projecteluune.com");
      change_dropdown_anchor(null);
      return;
    }

    if (path === "/bounty_main") {
      if (!wallet || !provider) {
        setAlertState({
          open: true,
          message: "Please connect your wallet and sign!",
          severity: "error",
        });
        handleNavigation("/");
      }
    }
    change_dropdown_anchor(null);
    handleNavigation(path);
  };

  const handleLinkTwitter = async (query: any) => {
    let header_verification = await getAuthHeaders();
    if (!header_verification) {
      return;
    }

    await verify_twitter(header_verification, query);
  };

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
            <a href={PRELUDE_URL}>
              <Button
                sx={{
                  cursor: "pointer",
                  width: "7vw",
                  position: "relative",
                  marginTop: "15px",
                  color: "white",
                  boxShadow: '0 0 20px #E6B1B8',
                  fontSize: "14px",
                  borderColor: 'white',
                  height: "50px",
                  fontWeight: "700",
                }}
                variant="outlined"
              >PRELUDE</Button>
            </a>
            <WalletWidget connected={provider} user={user_data!} />
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
            {window.location.pathname !== "/" ?
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
            {user_data?.admin ?
              <MenuItem onClick={() => handleDropdown_navigate("/admin")}>
                Admin
              </MenuItem>
              : null
            }
          </Menu>
          <Grid container item direction="row" justifyContent="flex-end" alignItems="flex-start" xs={5} sx={{ marginTop: "-20px" }}>
            <Grid container item alignItems="center" xs={1} justifyContent="flex-end">
              <Tooltip title="Switch on if you are using ledger with Phantom">
                <FormGroup onChange={() => toggle_ledger_switch()}>
                  <FormControlLabel control={<Switch checked={ledger_state} />} label="Ledger" labelPlacement="start" />
                </FormGroup>
              </Tooltip>
            </Grid>

            <Grid container item alignItems="center" xs={5} justifyContent="flex-end">
              {provider ? (
                <Box onMouseEnter={() => handleConnectHover()}>
                  <Button
                    style={styles.buttonDisconnect}
                    onClick={() => handleDisconnect()}
                    onMouseEnter={() => handleDisconnectHover()}
                  >
                    Disconnect
                  </Button>
                </Box>
              ) : null}
            </Grid>
          </Grid>


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
                    <Typography className="lore_text" sx={{ opacity: "0", fontSize: "18px" }}>A hidden world found us — and calls to us. Your time has come. To found a new nation. To brave a new frontier abound with riches, adventure, and danger. The moment has arrived to leave your mark on a better future. Will you answer the call?</Typography>
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
                handleConnectHover={handleConnectHover}
              />
            }
          />
          <Route
            path="bounty_main"
            element={

              <BOUNTY_PAGE
                handleDialogOpen={handleDialogOpen}
                handleDialogClose={handleDialogClose}
                dialog_data={dialog_data}
                change_dialog_data={change_dialog_data}
                quests_data={quests_data}
                change_quests_data={change_quests_data}
                user_data={user_data}
                change_user_data={change_user_data}
                leaderboard_data={leaderboard_data!}
                rewards_data={rewards_data}
                change_rewards_data={change_rewards_data}
                handleClaimAllQuestRewards={handleClaimAllQRewards}
                populate_data={populate_data}
                getAuthHeaders={getAuthHeaders}
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
                rewards_dialog_data={rewards_dialog_data!}
                set_rewards_dialog_data={set_rewards_dialog_data}
                welcome_popup_flag={welcome_popup_flag}
                handleWelcomeOpen={handleWelcomeOpen}
                handleMainHover={handleMainHover}
                claim_tutorial_flag={claim_tutorial_flag}
                setClaim_tutorial_flag={setClaim_tutorial_flag}
                handleNavigation={handleNavigation}
              />
            }
          />
          <Route path="lore" element={<LORE_PAGE />} />
          <Route path="admin" element={<ADMIN_PAGE
            getAuthHeaders={getAuthHeaders}
            setAlertState={setAlertState}
          />} />
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
          dialog_data={dialog_data!}
          user_data={user_data!}
          actionDone={actionDone}
          setActionDone={setActionDone}
          alert_state={alertState}
          setAlertState={setAlertState}
          getAuthHeaders={getAuthHeaders}
          handleTwitterButton={playClaimPassport}
          handleDialogHover={handleDialogHover}
          handleClaimQuestReward={handleClaimQuestReward}
          playRewardFanfare={playRewardFanfare}
          handleNavigation={handleNavigation}
        />
        <REWARDS_DIALOG
          rewards_dialog_state={rewards_dialog_state}
          handleRewardsClose={handleRewardsClose}
          handleClaimJourneyReward={handleClaimJourneyReward}
          rewards_dialog_data={rewards_dialog_data!}
          playRewardFanfare={playRewardFanfare}
          clicked_state={clicked_state}
          set_clicked_state={set_clicked_state}
          loadUserData={loadUserData}
        />
        <WELCOME_DIALOG
          handleWelcomeClose={handleWelcomeClose}
          welcome_popup={welcome_popup}
          playQuestOpen={playQuestOpen}
        />
        <MESSAGE_DIALOG
          message_dialog={message_dialog}
          handleMessageClose={handleMessageClose}
        />
        <SNACKBAR alertState={alertState} setAlertState={setAlertState} />
        {window.location.pathname === "/admin" ? null : (
          <Typography sx={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            lineHeight: "15px",
            letterSpacing: "0.1em",
            color: "#FFFFFF",
          }}>EARLY ALPHA ACCESS</Typography>
        )
        }
      </Box>
    </Box>
  );
};

export default memo(MAIN_PAGE);