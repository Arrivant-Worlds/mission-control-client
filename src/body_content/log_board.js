import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import styles from "./log_board_styles.js";
import MISSION_BLOCK from "./mission_block.js";
import plus from "../images/plus.png";
import minus from "../images/minus.png";
// import mission_data from "./mission_data.js";
// import weekly_mission_data from "./weekly_mission_data.js";
// import prime_mission_data from "./prime_mission_data.js";

export const LOG_BOARD = (props) => {
  const [expanded_tab, change_expanded_tab] = useState(true);
  // console.log(props.quests_data, "quest data");
  // console.log(props.user_data, "user data");
  // console.log("egaaev", props);
  const handleClick = (tab) => {
    // console.log(tab, "????");
    props.playQuestType();
    change_expanded_tab(tab);
  };

  return (
    <Box style={styles.log_board_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.log_grid_container} sx={{marginBottom: "0px !important"}} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between"
        onClick={() => handleClick(!expanded_tab)} alignItems="center">
          <Typography style={styles.log_title}
            style={styles.log_title}>
            COMPLETED MISSION LOG
          </Typography>
          <Box component="img" src={expanded_tab ? minus : plus}
          style={expanded_tab ? styles.minus : styles.plus}/>
        </Grid>
        <Box style={expanded_tab ? styles.hr : styles.hidden}/>
        <SimpleBar style={ expanded_tab ? { height: '534px', width: "100%" } : styles.hidden}>
          <Box style={expanded_tab ? styles.content_container : styles.hidden}
          >
            {
              props.quests_data.sort((a, b) => a.rewards > b.rewards ? 1 : -1).map((item, i) => {
                if (item.active_reward || item.user_quest_status === "Complete") {
                  return (
                    <MISSION_BLOCK
                    item_data={item} key={i}
                    handleDialogOpen={props.handleDialogOpen}
                    dialog_data={props.dialog_data}
                    change_dialog_data={props.change_dialog_data}
                    handleDialogHover={props.handleDialogHover}
                    set_rewards_dialog_data = {props.set_rewards_dialog_data}
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

export default memo(LOG_BOARD);

// <Typography style={props.expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
