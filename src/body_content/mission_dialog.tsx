import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./mission_dialog_styles";
import elune_icon from "../images/dialog_elune_icon.png";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@mui/material/Icon";
// import Mailchimp from "react-mailchimp-form";
import ACTION_COMPONENT from "./action_component";
import { AlertState, DialogData, MainProps, PayloadHeaders, RewardTypes, userResponseDTO } from "interfaces.js";

interface MISSION_DIALOG { 
  handleDialogClose: () => void;
  handleDialogOpen: () => void;
  dialog_state: boolean;
  dialog_data: DialogData | null
  user_data: MainProps['user_data']
  actionDone: boolean
  setActionDone: (action: boolean) => void;
  alert_state: AlertState
  setAlertState: (alertState: AlertState) => void;
  getAuthHeaders: MainProps['getAuthHeaders'];
  handleTwitterButton: () => void;
  handleDialogHover: () => void;
  handleClaimQuestReward: (reward_id: string, type_reward: RewardTypes) => void;
  playRewardFanfare: () => void;
  handleNavigation: (path: string) => void;
}

export default function MISSION_DIALOG(props: MISSION_DIALOG) {
  
  const renderIcon = () => {
    if(!props.dialog_data) return null;
    if (props.dialog_data.platform === "Discord") {
      return (
        <Icon className={"fa-brands fa-discord"} style={styles.icon}></Icon>
      );
    } else if (props.dialog_data.platform === "twitter") {
      return (
        <Icon className={"fa-brands fa-twitter"} style={styles.icon}></Icon>
      );
    } else {
      return null;
    }
  };

  return (
    <Dialog
      open={props.dialog_state}
      onClose={() => props.handleDialogClose()}
      BackdropProps={{
        style: {
          background: "rgba(26, 32, 38, 0.8)",
          zIndex: 1,
          position: 'relative',
        },
      }}
      PaperProps={{
        style: {
          background: "rgba(106, 106, 106, 0.3)",
          borderRadius: "5px",
          width: "69%",
          height: "450px",
          maxHeight: "none",
          maxWidth: "none",
        },
      }}
      sx = {{
        zIndex: 0
      }}
    >
      <DialogTitle style={styles.title_container}>
        {/* @ts-ignore */}
        <Typography style={styles.title}> {props.dialog_data?.title}</Typography>
        {props.dialog_state ? (
          <IconButton
            aria-label="close"
            onClick={() => props.handleDialogClose()}
            sx={{
              position: "absolute",
              right: 15,
              top: 0,
              color: "#6A6A6A",
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent style={styles.content_container}>
        <Grid container direction="column" style={styles.platform_container}>
          <Grid container direction="row" justifyContent="space-between">
            <Grid container item xs={7}>
              <Grid container item xs={1}>
                <Box component="img" src={elune_icon} alt="elune_icon" />
              </Grid>
              <Grid container item xs alignItems="center">
                <Typography>Project Eluüne (@ProjectEluune)</Typography>
              </Grid>
            </Grid>
            <Grid container item xs={1} justifyContent="flex-end">
              {renderIcon()}
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            style={styles.quest_container}
          >
            <Grid container item direction="column" xs={7}>
              <Typography style={styles.mission}>MISSION</Typography>
              <Typography style={styles.description}>
                {props.dialog_data?.description}
              </Typography>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                sx={{ width: "100%", marginTop: "40px" }}
                alignItems="flex-start"
              >
                <Grid container item direction="column" xs={4}>
                  {/* @ts-ignore */}
                  <Typography style={styles.xp_frequency}>xp</Typography>
                  {/* @ts-ignore */}
                  <Typography style={styles.xp_frequency_content}>
                    {`+${props.dialog_data?.xp}`}
                  </Typography>
                </Grid>
                <Grid container item direction="column" xs={6}>
                  {/* @ts-ignore */}
                  <Typography style={styles.xp_frequency}>Frequency</Typography>
                  {/* @ts-ignore */}
                  <Typography style={styles.xp_frequency_content}>
                    {props.dialog_data?.recurrence}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              {/* @ts-ignore */}
              <Box style={styles.action_frame}>
                <ACTION_COMPONENT
                  action_data={props.dialog_data?.action}
                  getAuthHeaders={props.getAuthHeaders}
                  user_data = {props.user_data}
                  handleTwitterButton={props.handleTwitterButton}
                  handleDialogHover={props.handleDialogHover}
                  actionDone={props.actionDone}
                  setActionDone={props.setActionDone}
                  alert_state={props.alert_state}
                  setAlertState={props.setAlertState}
                  dialog_data={props.dialog_data}
                  handleClaimQuestReward={props.handleClaimQuestReward}
                  playRewardFanfare={props.playRewardFanfare}
                  handleNavigation={props.handleNavigation}
                />
              </Box>
            </Grid>
          </Grid>

        </Grid>
      </DialogContent>
    </Dialog>
  );
}
