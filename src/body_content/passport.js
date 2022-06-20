import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import default_passport from '../images/default_passport_symbol.png';
import lock from '../images/lock.png';
import styles from './passport_styles.js';

export default function PASSPORT(props) {

  return (
    <div style={styles.egg_container}>
      <Grid>
        <Typography>eleriah pioneer</Typography>
        <Typography>PASSPORT</Typography>
        <Typography>issued: 06-06-22</Typography>
        <Grid container direction="column">
          <img src={default_passport} alt="passport_symbol"/>
          <div style={styles.hr}/>
          <Grid container direction="row">
            <img src={lock} alt="lock image"/>
            <Typography>
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
    </div>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
