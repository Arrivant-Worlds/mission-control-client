import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styles from './mission_dialog_styles.js';
import elune_icon from '../images/dialog_elune_icon.png';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Icon from '@mui/material/Icon';


export default function MISSION_DIALOG(props) {
  // console.log(props.dialog_state, "dialog state");
  const handleOnClick = () => {
    if (props.dialog_data.platform === "Discord") {
      //open up discord
    } else if (props.dialog_data.platform === "twitter") {
      //open up twitter
    }
  }

  const renderIcon = () => {
    if (props.dialog_data.platform === "Discord") {
      return (
        <Icon className={'fa-brands fa-discord'} style={styles.icon}></Icon>
      )
    } else if (props.dialog_data.platform === "twitter") {
      return (
        <Icon className={'fa-brands fa-twitter'} style={styles.icon}></Icon>
      )
    } else {
      return null
    }
  }

  return (
    <Dialog
      open={props.dialog_state}
      onClose={() => props.handleDialogClose()}
      BackdropProps={{
        style: {
          background: "rgba(26, 32, 38, 0.8)",
          opacity: "0.8",
        }
      }}
      PaperProps={{
       style: {
         background: "rgba(106, 106, 106, 0.3)",
         borderRadius: "5px",
         width: "69%",
         height: "87%",
         maxHeight: "none",
         maxWidth: "none",
       }
      }}
    >
      <DialogTitle style={styles.title_container}>
        <Typography style={styles.title}> {props.dialog_data.title}</Typography>
        {props.dialog_state? (
          <IconButton
            aria-label="close"
            onClick={() => props.handleDialogClose()}
            sx={{
              position: 'absolute',
              right: 15,
              top: 0,
              color: "#6A6A6A",
            }}
          >
            <CloseIcon />
          </IconButton>):null
        }
      </DialogTitle>
      <DialogContent style={styles.content_container}>
        <Grid container direction="column" style={styles.platform_container}>
          <Grid container direction="row" justifyContent="space-between" onClick={() => {handleOnClick()}}
            sx={{cursor: "pointer"}}
          >
            <Grid container item xs={7}>
              <Grid container item xs={1}>
                <img src={elune_icon} alt="elune_icon" />
              </Grid>
                <Grid container item xs alignItems="center">
                  <Typography>Project Eluüne (@ProjectEluune)</Typography>
                </Grid>
            </Grid>
            <Grid container item xs={1} justifyContent="flex-end">
              {renderIcon()}
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="space-between" style={styles.quest_container}>
            <Grid container item direction="column" xs={7}>
              <Typography style={styles.mission}>
                MISSION
              </Typography>
              <Typography style={styles.description}>
                {props.dialog_data.description}
              </Typography>
              <Grid container direction="row" justifyContent="space-between" sx={{width: "100%", marginTop: "40px"}} alignItems="flex-start">
                <Grid container item direction="column" xs={4}>
                  <Typography style={styles.xp_frequency}>
                    xp
                  </Typography>
                  <Typography style={styles.xp_frequency_content}>
                    {props.dialog_data.xp}
                  </Typography>
                </Grid>
                <Grid container item direction="column" xs={6}>
                  <Typography style={styles.xp_frequency}>
                    Frequency
                  </Typography>
                  <Typography style={styles.xp_frequency_content}>
                    {props.dialog_data.recurrence}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <div style={styles.upload_frame}/>
            </Grid>
          </Grid>
          <div style={styles.hr}/>
          <Typography style={styles.directions}>
            TO COMPLETE THIS BOUNTY
          </Typography>
          <Grid container direction="column">
            <Typography style={styles.guide}>GUIDE</Typography>
            <Grid container direction="row">
              <Grid item xs={.5}>
                <Typography style={styles.step_number}>{`1.`}</Typography>
              </Grid>
              <Grid container item direction="column" xs={10} style={styles.instructions}>
                <Typography style={styles.friends}>Invite your friends</Typography>
                <Typography>{`Inviting your friends is the easiest way to get 10 invites. Invite your friends only if you believe that our project has value for them.`}</Typography>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={.5}>
                <Typography style={styles.step_number}>{`2.`}</Typography>
              </Grid>
              <Grid container item direction="column" xs={10} style={styles.instructions}>
                <Typography style={styles.friends}>Post in Discord Groups</Typography>
                <Typography>{`Share your Discord invitation link in other Discord group. DON’T SPAM, respect the rules of the groups and share your link where it’s appropriate. FIND SERVERS/PLACES WHERE NOBODY ELSE IS POSTING OUR PROJECT. IT’S THE QUICKEST WAY TO GET INVITES!`}</Typography>
              </Grid>
            </Grid>
            <Grid>
              <Typography style={styles.submission}>SUBMISSION</Typography>
              <Typography>{`Track your invites with the invite tracker in Discord & upload a screenshot of your invites.`}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

// <Typography style={props.expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
