import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import styles from './rewards_dialog_styles.js';
import { useAnalytics } from '../mixpanel.js';


export default function REWARDS_DIALOG(props) {
  const { track, setPropertyIfNotExists, increment, setProperty } = useAnalytics()

  const handleOnClick = async () => {
    props.playRewardFanfare();
    props.set_clicked_state(true);
     if (props.rewards_dialog_data.type === "journey") {
      await props.handleClaimJourneyReward(
        props.rewards_dialog_data.id,
        props.rewards_dialog_data.type_reward
      );
      let now = new Date()
      try{
        setPropertyIfNotExists('First Journey Reward Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
        setProperty('Last Journey Reward Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
        setPropertyIfNotExists('Journey rewards claimed', 0)
        increment('Journey rewards claimed', 1);
      } catch(err){
        console.log("MIXPANEL ERR", err)
      }
    }
  };

  const handleOnClose = () => {
    props.handleRewardsClose();
    //set time out?
    props.set_clicked_state(false);
  };

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
          background: "rgba(106, 106, 106, 0.3)",
          borderRadius: "5px",
          width: "50%",
          maxHeight: "none",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => props.handleRewardsClose()}
          sx={{
            position: "absolute",
            right: 15,
            top: 0,
            color: "#6A6A6A",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ background: "rgba(13, 13, 13, 0.9)",
        borderRadius: "5px",
        height: "100%",
        width: "90%",
        padding: "25px 0px",
        margin: "0 auto 25px auto", }}>
        {props.clicked_state && props.rewards_dialog_data.type === "journey" ? (
          <Grid
            sx={{ height: "100%" }}
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <Box component="img" src={props.rewards_dialog_data.type_reward.url} alt="reward_img"
            sx={{width: "200px", height: "200px"}}
            />
            <Typography sx={{fontWeight: "700",
              fontSize: "18px",
              lineHeight: "25px",
              textAlign: "center",
              color: "#F6F6F6",}}
            >
              KEEP IT UP!
            </Typography>
            <Button sx={styles.button} onClick={() => handleOnClose()}>
              {props.rewards_dialog_data.type_reward.type === "CatchingAbility" ? `LET'S GO`: `BACK TO DASHBOARD`}
            </Button>
          </Grid>
        ) : (
          <Grid
            sx={{ height: "100%", paddingTop: "25px" }}
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid container item xs={5} justifyContent="center" alignItems="center">
              <Box component="img" src={props.rewards_dialog_data.type_reward.url} alt="reward_img"
                sx={{width: "200px", height: "200px"}}
              />
            </Grid>
            <Grid container item xs={5} direction="column" justifyContent="center" alignItems="center">
              <Typography sx={styles.title}>{props.rewards_dialog_data.description}</Typography>
              <Button sx={styles.button} onClick={() => handleOnClick()}>
              CLAIM REWARD
              </Button>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
