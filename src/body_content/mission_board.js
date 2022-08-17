import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import styles from "./mission_board_styles.js";
import MISSION_BLOCK from "./mission_block.js";
import COUNTDOWN from "./countdown.js";
import plus from "../images/plus.png";
import minus from "../images/minus.png";

const render_priority = ["link_discord","link_email","link_twitter"];

export const MISSION_BOARD = (props) => {

  const handleClick = (tab) => {
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
            style={props.expanded_tab === "prime" ? styles.mission_title : styles.mission_title_not_active}>PRIME MISSIONS
          </Typography>
          <Box component="img" src={props.expanded_tab === "prime" ? minus : plus}
          style={props.expanded_tab === "prime" ? styles.minus : styles.plus}/>
        </Grid>
        <Box style={props.expanded_tab === "prime" ? styles.hr : styles.hidden}/>
        <SimpleBar style={ props.expanded_tab === "prime" ? { height: '400px', width: "100%" } : styles.hidden}>
          <Box style={props.expanded_tab === "prime" ? styles.content_container : styles.hidden}
          >
            {
              [...props.quests_data].sort((a,b) => {
                    let index1 = render_priority.indexOf(a.type);
                    let index2 = render_priority.indexOf(b.type);
                    return index1 == -1 ? 1 : index2 == -1 ? -1 : index1 - index2;
                }).map((item, i) => {
                if (item.recurrence === "prime" && !item.active_reward && item.user_quest_status !== "Complete") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    user_data={props.user_data}
                    setAlertState={props.setAlertState}
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
          <Typography style={ props.expanded_tab === "daily" ? styles.mission_title : styles.mission_title_not_active }>{`DAILY MISSIONS (${props.user_data.daily_claim_remaining}/2)`}
          </Typography>
          <Grid item xs={2}>
            <COUNTDOWN user_data={props.user_data}/>
          </Grid>
          <Box
            component="img"
            src={props.expanded_tab === "daily" ? minus : plus}
            style={props.expanded_tab === "daily" ? styles.minus : styles.plus}
          />
        </Grid>
        <Box style={props.expanded_tab === "daily" ? styles.hr : styles.hidden}/>
        <SimpleBar style={ props.expanded_tab === "daily" ? {height: '400px', width: "100%" } : styles.hidden}>
          <Box style={props.expanded_tab === "daily" ? styles.content_container : styles.hidden}
          >
            {
              props.quests_data.map((item, i) => {
                if (item.recurrence === "daily" && !item.active_reward && item.user_quest_status !== "Complete") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    handleDialogClose={props.handleDialogClose}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    user_data={props.user_data}
                    setAlertState={props.setAlertState}
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
        <SimpleBar style={ props.expanded_tab === "weekly" ? { height: '400px', width: "100%" } : styles.hidden}>
          <Box style={props.expanded_tab === "weekly" ? styles.content_container : styles.hidden}
          >
            {
              props.quests_data.map((item, i) => {
                if (item.recurrence === "weekly" && !item.active_reward && item.user_quest_status !== "Complete") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    user_data={props.user_data}
                    setAlertState={props.setAlertState}
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
