import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
// import Alert from "@material-ui/lab/Alert";
// import styles from './passport_styles.js';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

export default function SNACKBAR(props) {
  const vertical = "bottom";
  const horizontal = "center";

  return (
    <Snackbar
      open={props.alertState.open}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={6000}
      onClose={() => props.setAlertState({ ...props.alertState, open: false })}
    >
      <MuiAlert
        onClose={() => props.setAlertState({ ...props.alertState, open: false })}
        severity={props.alertState.severity}
        variant="filled"
        sx={{display: "flex", alignItems: "center", height: "50px"}}
      >
        {props.alertState.message}
      </MuiAlert>
    </Snackbar>
  );
}
