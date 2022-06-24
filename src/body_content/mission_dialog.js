import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styles from './mission_dialog_styles.js';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export default function MISSION_DIALOG(props) {
  // console.log(props.dialog_state, "dialog state");
  return (
    <Dialog
      open={props.dialog_state}
      onClose={() => props.handleDialogClose()}
    >
      <DialogTitle> test
        {props.dialog_state? (
          <IconButton
            aria-label="close"
            onClick={() => props.handleDialogClose()}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>):null
        }
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {props.dialog_data.test}
        </Typography>
        <Typography gutterBottom>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </Typography>
        <Typography gutterBottom>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

// <Typography style={props.expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
