import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './mission_dialog_styles.js';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Icon from '@mui/material/Icon';
import {claim_reward} from "./../api_calls";


export default function REWARDS_DIALOG(props) {

  return (
    <Dialog
      open={props.rewards_dialog_state}
      onClose={props.handleRewardsClose}
      BackdropProps={{
        style: {
        }
      }}
      PaperProps={{
       style: {

       }
      }}
    >
      <DialogTitle>
        <Typography>Meow</Typography>
      </DialogTitle>
      <DialogContent>
      </DialogContent>
    </Dialog>
  );
}

// <Typography style={props.expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
