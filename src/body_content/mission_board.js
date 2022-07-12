import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import styles from "./mission_board_styles.js";
import MISSION_BLOCK from "./mission_block.js";
import plus from "../images/plus.png";
import minus from "../images/minus.png";
// import mission_data from "./mission_data.js";
// import weekly_mission_data from "./weekly_mission_data.js";
// import prime_mission_data from "./prime_mission_data.js";

export default function MISSION_BOARD(props) {
  // console.log(props.quests_data, "quest data");

  const handleClick = (tab) => {
    props.playQuestType();
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
              props.quests_data.map((item, i) => {
                if (item.recurrence === "prime") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i} handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data} change_dialog_data={props.change_dialog_data} handleDialogHover={props.handleDialogHover}/>
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
          <Typography style={ props.expanded_tab === "daily" ? styles.mission_title : styles.mission_title_not_active }>DAILY MISSIONS
          </Typography>
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
                if (item.recurrence === "daily") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i} handleDialogOpen={props.handleDialogOpen}
                    handleDialogClose={props.handleDialogClose} dialog_data={props.dialog_data} change_dialog_data={props.change_dialog_data} handleDialogHover={props.handleDialogHover}/>
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
                if (item.recurrence === "weekly") {
                  return (
                    <MISSION_BLOCK item_data={item} key={i} handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data} change_dialog_data={props.change_dialog_data} handleDialogHover={props.handleDialogHover}/>
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

// <Typography style={props.expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
