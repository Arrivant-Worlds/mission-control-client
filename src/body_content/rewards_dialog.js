import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import styles from "./rewards_dialog_styles.js";

export default function REWARDS_DIALOG(props) {
  const [clicked_state, set_clicked_state] = useState(false);

  // console.log(props.rewards_dialog_data.id, "Id of current quest for dialog");

  const handleOnClick = () => {
    set_clicked_state(true);
    if (props.rewards_dialog_data.type === "quest") {
      // console.log(props.rewards_dialog_data, "props??");
      props.handleClaimQuestReward(props.rewards_dialog_data.id);
      //rework higher level function using this id
      //perhaps split journey reward claim and quest claim and conditional to see which to fire.
      // props.handleRewardsClose();
    } else if (props.rewards_dialog_data.type === "journey") {
      props.handleClaimJourneyReward(
        props.rewards_dialog_data.id,
        props.rewards_dialog_data.type_reward
      );
    }
  };

  const handleOnClose = () => {
    props.handleRewardsClose();
    //set time out?
    set_clicked_state(false);
  };

  const renderReward = () => {
    if (props.rewards_dialog_data.type === "quest") {
      return (
        <Typography
          sx={styles.text}
        >{`+${props.rewards_dialog_data.xp} xp`}</Typography>
      )
    }
    // else {
    //   return (
    //     <Box component="image" src={props.rewards_dialog_data.rewards.url}/>
    //   )
    // }
  }

  return (
    <Dialog
      open={props.rewards_dialog_state}
      onClose={handleOnClose}
      BackdropProps={{
        style: {
          background: "rgba(26, 32, 38, 0.8)",
          opacity: "0.8",
        },
      }}
      PaperProps={{
        style: {
          background: "#000000",
          border: "1px solid #E6B2B9",
          width: "414px",
          height: "203px",
        },
      }}
    >
      <DialogContent sx={{ height: "100%" }}>
        {clicked_state ? (
          <Grid
            sx={{ height: "100%" }}
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <Typography sx={styles.title}>Reward Claimed!</Typography>
            <Typography sx={styles.text}>
              Keep gaining XP to level up!
            </Typography>
            <Button sx={styles.button} onClick={() => handleOnClose()}>
              DASHBOARD
            </Button>
          </Grid>
        ) : (
          <Grid
            sx={{ height: "100%" }}
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <Typography sx={styles.title}>Congratulations!</Typography>
            {
              renderReward()
            }
            <Button sx={styles.button} onClick={() => handleOnClick()}>
              CLAIM REWARD
            </Button>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}

// <Typography style={props.expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
