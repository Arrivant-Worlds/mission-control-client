import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styles from './connect_page_styles.js';

export default function CONNECT_PAGE(props) {
  return (
    <div style={styles.connect_container}>
      <Typography style={styles.connect_title}>CONNECT YOUR CRYPTO WALLET</Typography>
      <Typography style={styles.connect_text}>YOUR BOUNTY WILL BE PLENTIFUL.</Typography>
      <Button variant="contained" style={styles.button}>CONNECT WALLET</Button>
    </div>
  );
}
