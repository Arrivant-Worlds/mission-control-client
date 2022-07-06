import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
// import Alert from "@material-ui/lab/Alert";
// import styles from './passport_styles.js';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//   props,
//   ref,
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

export default function SNACKBAR(props) {

  return (
    <Snackbar
      open={props.alertState.open}
      autoHideDuration={6000}
      onClose={() => props.setAlertState({ ...props.alertState, open: false })}
    >
      <MuiAlert
        onClose={() => props.setAlertState({ ...props.alertState, open: false })}
        severity={props.alertState.severity}
        variant="filled"
      >
        {props.alertState.message}
      </MuiAlert>
    </Snackbar>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
