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
  const [clicked_state, set_clicked_state] = useState(false);
  const { track, setPropertyIfNotExists, increment, setProperty } = useAnalytics()
  // console.log(props.rewards_dialog_data.id, "Id of current quest for dialog");

  const handleOnClick = async () => {
    props.playRewardFanfare();
    set_clicked_state(true);
<<<<<<< HEAD
    // if (props.rewards_dialog_data.type === "quest") {
    //   // console.log(props.rewards_dialog_data, "props??");
    //   props.handleClaimQuestReward(props.rewards_dialog_data.id);
    //   props.handleRewardsClose();
    //   track('Mission Claim',{
    //     event_category: 'Missions',
    //     event_label:'Claim',
    //     xp: props.rewards_dialog_data.xp,
    //   })
    //   let now = new Date()
    //   try{
    //     setPropertyIfNotExists('First Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
    //     setProperty('Last Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
    //     setPropertyIfNotExists('Missions done', 0)
    //     increment('Missions done', 1);
    //   } catch(err){
    //     console.log("MIXPANEL ERR", err)
    //   }
    //
    //   //rework higher level function using this id
    //   //perhaps split journey reward claim and quest claim and conditional to see which to fire.
    // } else
     if (props.rewards_dialog_data.type === "journey") {
=======
    if (props.rewards_dialog_data.type === "quest") {
      // console.log(props.rewards_dialog_data, "props??");
      props.handleClaimQuestReward(props.rewards_dialog_data.id);
      props.handleRewardsClose();
      track('Mission Claim',{
        event_category: 'Missions',
        event_label:`${props.rewards_dialog_data.title}`,
        xp: props.rewards_dialog_data.xp,
      })
      let now = new Date()
      try{
        setPropertyIfNotExists('First Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
        setProperty('Last Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
        setPropertyIfNotExists('Missions done', 0)
        increment('Missions done', 1);
      } catch(err){
        console.log("MIXPANEL ERR", err)
      }

      //rework higher level function using this id
      //perhaps split journey reward claim and quest claim and conditional to see which to fire.
    } else if (props.rewards_dialog_data.type === "journey") {
>>>>>>> be88ed6afbf7daf377fb167ba592a73c67969b23
      // set_clicked_state(true);
      await props.handleClaimJourneyReward(
        props.rewards_dialog_data.id,
        props.rewards_dialog_data.type_reward
      );
      // props.handleClaimJourneyReward(props.rewards_dialog_data.id);
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
    set_clicked_state(false);
  };

  // console.log("props", props.rewards_dialog_data.type)
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
        {clicked_state && props.rewards_dialog_data.type === "journey" ? (
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

// <Typography style={props.expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
