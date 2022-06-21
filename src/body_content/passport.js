import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import default_passport from '../images/default_passport_symbol.png';
import lock from '../images/lock.png';
import styles from './passport_styles.js';

export default function PASSPORT(props) {

  return (
    <Grid style={styles.passport_container}>
      <Typography style={styles.title}>eleriah pioneer</Typography>
      <Typography style={styles.passport}>PASSPORT</Typography>
      <Typography style={styles.date}>issued: 06-06-22</Typography>
      <Grid container direction="column" justifyContent="center" alignItems="center" style={styles.image_container}>
        <img src={default_passport} alt="passport_symbol" style={styles.passport_image}/>
        <div style={styles.hr}/>
        <Grid container direction="row" justifyContent="center" alignItems="center" style={styles.decoder_container}>
          <img src={lock} alt="lock image" style={styles.lock_image}/>
          <Typography style={styles.decoder_text}>
            Locked
          </Typography>
        </Grid>
      </Grid>
      <Typography>survival assessment</Typography>
      <Typography>unlikely</Typography>
      <div style={styles.hr}/>
      <Grid>
        <Grid>
          <Typography>Rank XP</Typography>
        </Grid>
        <Grid>
          <div/>
        </Grid>
        <Grid>
          <Typography>9,999/999,999</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
