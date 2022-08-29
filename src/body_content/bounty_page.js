import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Badge from '@mui/material/Badge';
import MISSION_BOARD from "./mission_board.js";
import LOG_BOARD from "./log_board.js";
import LEADERBOARD from "./leaderboard.js";
import REWARDS from "./rewards.js";
import EGG from "./egg.js";
import PASSPORT from "./passport.js";
import { useAnalytics } from '../mixpanel.js';
import loreIcon from "../images/Lore_Icon.png"
import {
 verify_discord,
} from "./../api_calls";
import bounty_frame from "../images/bounty_frame.png";
import styles from "./bounty_page_styles.js";
import { useNavigate } from "react-router";
import {useWallet} from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

export const BOUNTY_PAGE = (props) => {
  const { track, setPropertyIfNotExists, increment, setProperty } = useAnalytics();
  const [tab1_value, tab1_setValue] = useState(0);
  const [tab2_value, tab2_setValue] = useState(0);
  const [expanded_tab, change_expanded_tab] = useState("prime");
  let [claimableCount, setClaimableCount] = useState(0);
  const { wallet, publicKey } = useWallet();

  useEffect(() => {
    let allActive = props.quests_data.filter((i)=> i.active_reward.length > 0)
    setClaimableCount(allActive.length);
    if (props.claim_tutorial_flag) {
      props.setAlertState({
        open: true,
        message:
          "After your complete missions, check the Log tab to claim rewards!",
        severity: "success",
      });
      props.setClaim_tutorial_flag(false);
      return;
    }
  }, [props.quests_data]);

  useEffect(() => {
    if (props.welcome_popup_flag) {
      props.handleWelcomeOpen();
      return;
    }

  }, [props.welcome_popup_flag])

  const handleLinkDiscord = async (token_type, access_token) => {
    let header_verification = await props.getWithExpiration();
    await verify_discord(
        header_verification,
        token_type,
        access_token
    );
  }

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [tokenType, accessToken] = [fragment.get('token_type'), fragment.get('access_token')];
    let discordAccessToken = tokenType && accessToken
    if (discordAccessToken && publicKey) {
      handleLinkDiscord(tokenType, accessToken)
      props.setAlertState({
        open: true,
        message:
          "Discord authentication success!",
        severity: "success",
      });
    }
  }, [publicKey])

  const handleChange = (event, newValue) => {
    if (event.target.id === "tab0") {
      tab1_setValue(newValue);
      props.playMissionsTab();
    } else if (event.target.id === "tab1") {
      tab1_setValue(newValue);
      props.playLeaderboardTab();
    } else if (event.target.id === "tab2") {
      tab1_setValue(newValue);
      props.playRewardsTab();
    } else if (event.target.id === "tab3") {
      tab2_setValue(newValue);
      props.playEggTab();
    } else if (event.target.id === "tab4") {
      tab2_setValue(newValue);
      props.playEggTab();
    }
  };

  const handleLoreNavigation = () => {
    props.handleNavigation("/lore");
    try {
      track('Lore Icon Click',{
        event_category: 'Button Click',
        event_label: "Lore Icon Click",
      })
    } catch (err) {
      console.log(err);
    }
  }

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        aria-labelledby={`tab${index}`}
        {...other}
      >
        {value === index && (
          <Grid>
            <Typography component={"div"} variant={"body2"}>
              {children}
            </Typography>
          </Grid>
        )}
      </Box>
    );
  };

  const a11yProps = (index) => {
    return {
      id: `tab${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
      style: styles.tab_label,
      sx: [
        {
          color: "#AAAAAA",
          fontWeight: "700",
          overflow: "visible",
        },
        {
          "&:hover": {
            color: "#F6F6F6",
            fontWeight: "700",
            opacity: 1,
          },
        },
        {
          "&.Mui-selected": {
            color: "#F6F6F6",
          },
        },
      ],
    };
  };

  const handleClick = (state) => {
    props.change_body_state(state);
  };

  const container_style = {
    width: "87%",
  };

  const container_style_combined = {
    ...container_style,
    ...styles.bounty_container,
  };

  return (
    <Box  sx={styles.tab_label_container}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        sx={{ marginBottom: "20px", width: "87%" }}
      >
        <Grid container item xs={4} style={styles.tab_label_grid}>
          <Tabs
            value={tab1_value}
            onChange={handleChange}
            textColor="primary"
            sx={styles.tab_label}
            TabIndicatorProps={{ style: { zIndex: 2 } }}
          >
            <Tab label="MISSIONS" {...a11yProps(0)} />
            <Tab label="LEADERBOARD" {...a11yProps(1)} />

          </Tabs>
          <Box style={styles.bottom_border}></Box>
        </Grid>
        <Grid container item xs={4} style={styles.tab_label_grid_2}>
          <Tabs
            value={tab2_value}
            onChange={handleChange}
            textColor="primary"
            TabIndicatorProps={{ style: { zIndex: 2 } }}
          >
            <Tab label="REWARDS" {...a11yProps(3)} />
            <Tab label={
              <Badge badgeContent={claimableCount} color="primary" {...a11yProps(4)}
                sx={{color: tab2_value === 1 || claimableCount > 0 ? "#F6F6F6" : "#AAAAAA", fontWeight: "700"}}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}>LOG
              </Badge>}
              {...a11yProps(4)}
            />
          </Tabs>
          <Box style={styles.bottom_border}></Box>
        </Grid>
      </Grid>
      <Grid
        container
        style={container_style_combined}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid
          container
          item
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={4}
        >
          <TabPanel
            value={tab1_value}
            index={0}
            sx={styles.tab_content_container}
          >
            <MISSION_BOARD
              user_data={props.user_data}
              expanded_tab={expanded_tab}
              change_expanded_tab={change_expanded_tab}
              quests_data={props.quests_data}
              playQuestType={props.playQuestType}
              handleDialogOpen={props.handleDialogOpen}
              handleDialogClose={props.handleDialogClose}
              handleDialogHover={props.handleDialogHover}
              dialog_data={props.dialog_data}
              change_dialog_data={props.change_dialog_data}
              setAlertState={props.setAlertState}
            />
          </TabPanel>
          <TabPanel
            value={tab1_value}
            index={1}
            style={styles.tab_content_container}
          >
            <LEADERBOARD leaderboard_data={props.leaderboard_data} />
          </TabPanel>
        </Grid>
        <Grid container item xs={4} direction="column" alignItems="center">
          <Box
            onMouseEnter = {props.handleMainHover}
            onClick = {handleLoreNavigation}
            sx={{
              // height: "10vh",
              cursor: "pointer",
              width: "8vw",
              marginTop: "-100px",
              marginBottom: "50px",
              position: "relative",
              zIndex: "3",
            }}
            component="img"
            src={loreIcon}
            alt="lore_icon"
          />
          <Box style={styles.center_panel_container}>
            <Box sx={{
              background: "linear-gradient(270deg, rgba(230, 178, 185, 0) 0%, #E6B2B9 25%, #E6B2B9 75%, rgba(230, 178, 185, 0) 100%)",
              opacity: "0.9",
              height: "1px",
              width: "70%",
              boxShadow: "0px 0px 13.7421px 0.916143px #E6B1B8",
              position: "absolute",
              top: "-1px"
              }}/>
            <PASSPORT user_data={props.user_data} />
            <Box sx={{
              background: "linear-gradient(270deg, rgba(230, 178, 185, 0) 0%, #E6B2B9 25%, #E6B2B9 75%, rgba(230, 178, 185, 0) 100%)",
              opacity: "0.9",
              boxShadow: "0px 0px 13.7421px 0.916143px #E6B1B8",
              height: "1px",
              width: "100%",
              position: "absolute",
              bottom: "-1px"
              }}/>
            <Box/>
          </Box>
        </Grid>
        <Grid
          container
          item
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={4}
        >
          <TabPanel
            value={tab2_value}
            index={0}
            style={styles.tab_content_container}
          >
            <REWARDS
              rewards_data={props.rewards_data}
              user_data={props.user_data}
              handleRewardsOpen={props.handleRewardsOpen}
              handleRewardsClose={props.handleRewardsClose}
              getWithExpiration={props.getWithExpiration}
              sign_message={props.sign_message}
              loading_state={props.loading_state}
              change_loading_state={props.change_loading_state}
              populate_data={props.populate_data}
              rewards_dialog_data={props.rewards_dialog_data}
              set_rewards_dialog_data={props.set_rewards_dialog_data}
            />
          </TabPanel>
          <TabPanel
            value={tab2_value}
            index={1}
            style={styles.tab_content_container}
          >
            <LOG_BOARD
              user_data={props.user_data}
              quests_data={props.quests_data}
              playQuestType={props.playQuestType}
              handleDialogOpen={props.handleDialogOpen}
              handleDialogClose={props.handleDialogClose}
              handleDialogHover={props.handleDialogHover}
              dialog_data={props.dialog_data}
              set_rewards_dialog_data={props.set_rewards_dialog_data}
              change_dialog_data={props.change_dialog_data}
              setAlertState={props.setAlertState}
            />
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(BOUNTY_PAGE);
