import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import styles from "./mission_board_styles";
import MISSION_BLOCK from "./mission_block";
import plus from "../images/plus.png";
import minus from "../images/minus.png";
import { AlertState, MainProps } from "interfaces";
const render_priority = ["link_discord","link_email","link_twitter", "update_wallet"];

interface MissionBoardProps {
  user_data: MainProps['user_data']
  quests_data: MainProps['quests_data']
  handleDialogOpen: MainProps['handleDialogOpen']
  handleDialogClose: MainProps['handleDialogClose']
  handleDialogHover: () => void;
  dialog_data: MainProps['dialog_data']
  change_dialog_data: MainProps['change_dialog_data']
  setAlertState: (data: AlertState) => void;
  playQuestType: () => void;
  expanded_tab: string;
  change_expanded_tab: (data: string) => void;
}

export const MISSION_BOARD = (props: MissionBoardProps) => {
  // console.log(props.quests_data, "quests?");

  const handleClick = (tab: string) => {
    props.playQuestType();
    if (tab === props.expanded_tab) {
      props.change_expanded_tab("none");
      return
    }
    props.change_expanded_tab(tab);
  };
  return (
    <Box style={styles.mission_board_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.mission_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between"
        onClick={() => handleClick("prime")} alignItems="center">
          <Typography style={styles.mission_title}
          //@ts-ignore
            style={props.expanded_tab === "prime" ? styles.mission_title : styles.mission_title_not_active}>PRIME MISSIONS
          </Typography>
          <Box component="img" src={props.expanded_tab === "prime" ? minus : plus}
          style={props.expanded_tab === "prime" ? styles.minus : styles.plus}/>
        </Grid>
        <Box style={props.expanded_tab === "prime" ? styles.hr : styles.hidden}/>
        <SimpleBar style={ props.expanded_tab === "prime" ? { height: '338px', width: "100%" } : styles.hidden}>
          {/* @ts-ignore*/}
          <Box style={props.expanded_tab === "prime" ? styles.content_container : styles.hidden}
          >
            {
              [...props.quests_data!].sort((a,b) => {
                    let index1 = render_priority.indexOf(a.type);
                    let index2 = render_priority.indexOf(b.type);
                    return index1 == -1 ? 1 : index2 == -1 ? -1 : index1 - index2;
                }).map((item, i) => {
                if (item.recurrence === "prime" && item.active_reward.length === 0 && item.user_quest_status !== "Complete") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    user_data={props.user_data!}
                    setAlertState={props.setAlertState}
                    from="mission"
                    />
                  )
                } else {
                  return null;
                }
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.mission_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between"
          onClick={() => handleClick("daily")} alignItems="center">
          <Typography style={ props.expanded_tab === "daily" ? styles.mission_title : styles.mission_title_not_active }>{`DAILY MISSIONS`}
          </Typography>
          <Box
            component="img"
            src={props.expanded_tab === "daily" ? minus : plus}
            style={props.expanded_tab === "daily" ? styles.minus : styles.plus}
          />
        </Grid>
        <Box style={props.expanded_tab === "daily" ? styles.hr : styles.hidden}/>
        <SimpleBar style={ props.expanded_tab === "daily" ? {height: '338px', width: "100%" } : styles.hidden}>
          {/* @ts-ignore*/}
          <Box style={props.expanded_tab === "daily" ? styles.content_container : styles.hidden}
          >
            {
              props.quests_data!.map((item, i) => {
                if (item.recurrence === "daily" && item.active_reward.length === 0 && item.user_quest_status !== "Complete") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    user_data={props.user_data!}
                    setAlertState={props.setAlertState}
                    from="mission"
                    />
                  )
                } else {
                  return null;
                }
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
      <Grid
        container
        item
        direction="column"
        justifyContent="space-between"
        style={styles.mission_grid_container}
        alignItems="center"
      >
        <Grid
          container
          item
          direction="row"
          justifyContent="space-between"
          onClick={() => handleClick("weekly")}
          alignItems="center"
        >
          <Typography
            style={styles.mission_title}
            //@ts-ignore
            style={
              props.expanded_tab === "weekly"
                ? styles.mission_title
                : styles.mission_title_not_active
            }
          >
            WEEKLY MISSIONS
          </Typography>
          <Box
            component="img"
            src={props.expanded_tab === "weekly" ? minus : plus}
            style={props.expanded_tab === "weekly" ? styles.minus : styles.plus}
          />
        </Grid>
        <Box style={props.expanded_tab === "weekly" ? styles.hr : styles.hidden}/>
        <SimpleBar style={ props.expanded_tab === "weekly" ? { height: '338px', width: "100%" } : styles.hidden}>
          {/* @ts-ignore*/}
          <Box style={props.expanded_tab === "weekly" ? styles.content_container : styles.hidden}
          >
            {
              props.quests_data!.map((item, i) => {
                if (item.recurrence === "weekly" && item.active_reward.length === 0 && item.user_quest_status !== "Complete") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    user_data={props.user_data!}
                    setAlertState={props.setAlertState}
                    from="mission"
                    />
                  )
                } else {
                  return null;
                }
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
      <Grid
        container
        item
        direction="column"
        justifyContent="space-between"
        style={styles.mission_grid_container}
        alignItems="center"
      >
        <Grid
          container
          item
          direction="row"
          justifyContent="space-between"
          onClick={() => handleClick("permanent")}
          alignItems="center"
        >
          <Typography
            style={styles.mission_title}
          //@ts-ignore
            style={
              props.expanded_tab === "permanent"
                ? styles.mission_title
                : styles.mission_title_not_active
            }
          >
            PERMANENT MISSIONS
          </Typography>
          <Box
            component="img"
            src={props.expanded_tab === "permanent" ? minus : plus}
            style={props.expanded_tab === "permanent" ? styles.minus : styles.plus}
          />
        </Grid>
        <Box style={props.expanded_tab === "permanent" ? styles.hr : styles.hidden}/>
        <SimpleBar style={ props.expanded_tab === "permanent" ? { height: '338px', width: "100%" } : styles.hidden}>
          {/* @ts-ignore*/ }
          <Box style={props.expanded_tab === "permanent" ? styles.content_container : styles.hidden}
          >
            {
              props.quests_data!.map((item, i) => {
                if (item.recurrence === "permanent") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    user_data={props.user_data!}
                    setAlertState={props.setAlertState}
                    from="mission"
                    />
                  )
                } else {
                  return null;
                }
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
    </Box>
  );
}

export default memo(MISSION_BOARD);
