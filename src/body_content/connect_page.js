import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import styles from './connect_page_styles.js';

export default function CONNECT_PAGE(props) {
  let navigate = useNavigate();

  const handleClick = (state) => {
    // props.change_body_state(state);
    navigate(state);
  }

  return (
    <Grid container sx={styles.connect_container} direction="column" justifyContent="center" alignItems="center">
      <Grid item xs={1}>
        <Typography sx={styles.connect_title}>CONNECT YOUR CRYPTO WALLET</Typography>
      </Grid>
      <Grid container item xs={1} justifyContent="center" alignItems="center">
        <Typography sx={styles.connect_text}>YOUR BOUNTY WILL BE PLENTIFUL.</Typography>
      </Grid>
      <Grid container item xs={3} direction="column" justifyContent="flex-end" alignItems="center">
        <Button variant="contained" sx={styles.button} onClick={() => handleClick("/connect_wallet")}>CONNECT WALLET</Button>
      </Grid>
    </Grid>
  );
}
