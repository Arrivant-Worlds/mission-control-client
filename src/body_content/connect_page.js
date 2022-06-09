import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styles from './connect_page_styles.js';

export default function CONNECT_PAGE(props) {

  const handleClick = (state) => {
    props.change_body_state("bounty_main");
    // props.change_body_state(state);
  }

  return (
    <Grid container style={styles.connect_container} direction="column" justifyContent="center" alignItems="center">
      <Grid item xs={1}>
        <Typography style={styles.connect_title}>CONNECT YOUR CRYPTO WALLET</Typography>
      </Grid>
      <Grid container item xs={1} justifyContent="center" alignItems="center">
        <Typography style={styles.connect_text}>YOUR BOUNTY WILL BE PLENTIFUL.</Typography>
      </Grid>
      <Grid container item xs={3} direction="column" justifyContent="flex-end" alignItems="center">
        <Button variant="contained" style={styles.button} onClick={() => handleClick("connect_wallet")}>CONNECT WALLET</Button>
      </Grid>
    </Grid>
  );
}
