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
import { useWallet } from "@solana/wallet-adapter-react";
import { useWeb3Wallet } from "../App.js";

export default function REWARDS_DIALOG(props) {
  const { track, setPropertyIfNotExists, increment, setProperty } = useAnalytics()
  const { signTransaction, sendTransaction, publicKey } = useWeb3Wallet()
  const handleOnClick = async () => {
    props.playRewardFanfare();
    props.set_clicked_state(true);
     if (props.rewards_dialog_data.type === "journey") {
      console.log("journey", props.rewards_dialog_data)
      console.log("key", publicKey)
      let claim = await props.handleClaimJourneyReward(
        props.rewards_dialog_data.id,
        props.rewards_dialog_data,
        signTransaction,
        sendTransaction
      );
      let now = new Date()
      try{
        if(claim.status === 200){
          track('Claim Journey Reward',{
            event_category: 'Journey',
            event_label: `${props.rewards_dialog_data.title}`,
          })
          setPropertyIfNotExists('First Journey Reward Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
          setProperty('Last Journey Reward Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
          setPropertyIfNotExists('Journey rewards claimed', 0)
          increment('Journey rewards claimed', 1);
        }
      } catch(err){
        console.log("MIXPANEL ERR", err)
      }
    }
  };

  const handleOnClose = () => {
    props.handleRewardsClose();
    //set time out?
    props.set_clicked_state(false);
    props.loadUserData()
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
          handleOnClose()
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
              <Typography sx={styles.title}>{props.rewards_dialog_data.title}</Typography>
              <Typography sx={styles.text}>{props.rewards_dialog_data.description}</Typography>
              <Button 
                sx={styles.button} 
                disabled = {props.rewards_dialog_data.status === "claimable" ? false : true} 
                onClick={() => handleOnClick()}
              >
              CLAIM REWARD
              </Button>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
