import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Badge from '@mui/material/Badge';
import MISSION_BOARD from "./mission_board";
import LOG_BOARD from "./log_board";
import LEADERBOARD from "./leaderboard";
import REWARDS from "./rewards";
import PASSPORT from "./passport";
import { useAnalytics } from '../mixpanel';
import loreIcon from "../images/Lore_Icon.png"
import "./bounty_page_styles.css";
import {
  verify_discord,
} from "../api_calls";
import { useWeb3Wallet } from "../App";
import { MainProps, RewardsDialogData } from "interfaces";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment     
// @ts-ignore
export interface BountyProps extends MainProps {
  setClaim_tutorial_flag: (claim_tutorial_flag: boolean) => void;
  handleWelcomeOpen: () => void;
  playMissionsTab: () => void;
  playLeaderboardTab: () => void;
  playRewardsTab: () => void;
  playEggTab: () => void;
  handleDialogHover: () => void;
  playQuestType: () => void;
  handleMainHover: () => void;
  set_rewards_dialog_data: (data: RewardsDialogData) => void;
  rewards_dialog_data: RewardsDialogData;
  claim_tutorial_flag: boolean;
  welcome_popup_flag: boolean;
}

export const BOUNTY_PAGE = (props: BountyProps) => {
  const { track } = useAnalytics();
  const [tab1_value, tab1_setValue] = useState(0);
  const [tab2_value, tab2_setValue] = useState(0);
  const [expanded_tab, change_expanded_tab] = useState("prime");
  let [claimableCount, setClaimableCount] = useState(0);
  let [journeyRewardClaimableCount, setJourneyRewardClaimableCount] = useState(0);
  useEffect(() => {
    if(!props.quests_data || !props.rewards_data) return;
    let allActiveQuestRewards = props.quests_data?.filter((i) => i.active_reward.length > 0)
    let allActiveJourneyRewards = props.rewards_data?.filter((r) => r.claimed_status === "claimable")
    if(allActiveQuestRewards){
      setClaimableCount(allActiveQuestRewards.length);
    }
    if(allActiveJourneyRewards){
      setJourneyRewardClaimableCount(allActiveJourneyRewards.length);
    }
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
  }, [props]);

  useEffect(() => {
    if (props.welcome_popup_flag) {
      props.handleWelcomeOpen();
      return;
    }

  }, [props.welcome_popup_flag])


  const handleChange = (event: any, newValue: any) => {
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
      track('Lore Icon Click', {
        event_category: 'Button Click',
        event_label: "Lore Icon Click",
      })
    } catch (err) {
      console.log(err);
    }
  }

  const TabPanel = (props: any) => {
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

  const a11yProps = (index: number) => {
    return {
      id: `tab${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
      className: "tab_label",
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


  return (
    <Box className="tab_label_container">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        sx={{ marginBottom: "20px", width: "87%" }}
      >
        <Grid container item xs={4} style={{
          position: "relative",
        }}>
          <Tabs
            value={tab1_value}
            onChange={handleChange}
            textColor="primary"
            TabIndicatorProps={{ style: { zIndex: 2 } }}
          >
            {/* @ts-ignore */}
            <Tab label={"MISSIONS"} {...a11yProps(0)} />
            {/* @ts-ignore */}
            <Tab label={
              "LEADERBOARD"
            }
              {...a11yProps(1)}
            />
          </Tabs>
          <Box style={{
            position: "absolute",
            height: "2px",
            bottom: "0",
            width: "100%",
            backgroundColor: "#888888",
          }}></Box>
        </Grid>
        <Grid container item xs={4} style={{
          position: "relative",
        }}>
          <Tabs
            value={tab2_value}
            onChange={handleChange}
            textColor="primary"
            TabIndicatorProps={{ style: { zIndex: 2 } }}
          >
            {/* @ts-ignore */}
            <Tab label={<Badge badgeContent={journeyRewardClaimableCount} color="primary" {...a11yProps(4)}
              sx={{ color: tab2_value === 1 || claimableCount > 0 ? "#F6F6F6" : "#AAAAAA", fontWeight: "700" }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}>REWARDS
            </Badge>} {...a11yProps(3)} />
            {/* @ts-ignore */}
            <Tab label={
              //@ts-ignore
              <Badge badgeContent={claimableCount} color="primary" {...a11yProps(4)}
                sx={{ color: tab2_value === 1 || claimableCount > 0 ? "#F6F6F6" : "#AAAAAA", fontWeight: "700" }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}>LOG
              </Badge>}
              {...a11yProps(4)}
            />
          </Tabs>
          <Box style={{
            position: "absolute",
            height: "2px",
            bottom: "0",
            width: "100%",
            backgroundColor: "#888888",
          }}></Box>
        </Grid>
      </Grid>
      <Grid
        container
        style={{width: "87%",}}
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
            className="tab_content_container"
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
            className="tab_content_container"
          >
            {props.leaderboard_data && props.user_data && (
              <LEADERBOARD leaderboard_data={props.leaderboard_data} user_data={props.user_data} />
            )}
          </TabPanel>
        </Grid>
        <Grid container item xs={4} direction="column" alignItems="center">
          <Box
            onMouseEnter={props.handleMainHover}
            onClick={handleLoreNavigation}
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
          <Box style={{
            width: "270px",
            height: "417px",
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.539) 25.01%, rgba(15, 15, 15, 0.285) 120.09%)",
            border: "0.916143px solid #6A6A6A",
            backdropFilter: "blur(36.6457px)",
            borderRadius: "4.58071px 61.3816px 4.58071px 4.58071px",
            marginBottom: "23px",
            marginLeft: "2px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            position: "relative",
          }}>
            <Box sx={{
              background: "linear-gradient(270deg, rgba(230, 178, 185, 0) 0%, #E6B2B9 25%, #E6B2B9 75%, rgba(230, 178, 185, 0) 100%)",
              opacity: "0.9",
              height: "1px",
              width: "70%",
              boxShadow: "0px 0px 13.7421px 0.916143px #E6B1B8",
              position: "absolute",
              top: "-1px"
            }} />
            {props.user_data && (
              <PASSPORT user_data={props.user_data} />
            )}
            <Box sx={{
              background: "linear-gradient(270deg, rgba(230, 178, 185, 0) 0%, #E6B2B9 25%, #E6B2B9 75%, rgba(230, 178, 185, 0) 100%)",
              opacity: "0.9",
              boxShadow: "0px 0px 13.7421px 0.916143px #E6B1B8",
              height: "1px",
              width: "100%",
              position: "absolute",
              bottom: "-1px"
            }} />
            <Box />
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
            className="tab_content_container"
          >
              <REWARDS
              rewards_data={props.rewards_data}
              user_data={props.user_data}
              handleRewardsOpen={props.handleRewardsOpen}
              handleRewardsClose={props.handleRewardsClose}
              getAuthHeaders={props.getAuthHeaders}
              loading_state={props.loading_state}
              change_loading_state={props.change_loading_state}
              rewards_dialog_data={props.rewards_dialog_data}
              set_rewards_dialog_data={props.set_rewards_dialog_data}
            />
          </TabPanel>
          <TabPanel
            value={tab2_value}
            index={1}
            className="tab_content_container"
          >
            <LOG_BOARD
              user_data={props.user_data}
              quests_data={props.quests_data}
              playQuestType={props.playQuestType}
              handleClaimAllQuestRewards={props.handleClaimAllQuestRewards}
              handleDialogOpen={props.handleDialogOpen}
              handleDialogClose={props.handleDialogClose}
              handleDialogHover={props.handleDialogHover}
              dialog_data={props.dialog_data}
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
