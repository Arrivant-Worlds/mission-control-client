import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import default_passport from '../images/default_passport_symbol.png';
import lock from '../images/lock.png';
import styles from './passport_styles.js';

export default function PASSPORT(props) {
  const [exp_value, set_exp_value] = useState(0);
  let xp = 99999;
  //change to props.exp etc in render.

  useEffect(() => {
    let exp_percent = calculate_progress(99999);
    //change to props.exp etc.
    set_exp_value(Math.round(exp_percent));
  }, []);

   const calculate_progress = (exp) => {
     return (100 * exp) / 999999;
   }

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
      <Typography style={styles.survival_text}>survival assessment</Typography>
      <Typography style={styles.assessment_text}>unlikely</Typography>
      <div style={styles.hr}/>
      <Grid container direction="row" justifyContent="space-around" alignItems="center" style={styles.XP_container}>
        <Grid item xs={2.5}>
          <Typography style={styles.rank_text}>Rank XP</Typography>
        </Grid>
        <Grid container item xs sx={{position: "relative"}}>
          <div style={styles.progress_container}>
            <div style={
              { width: exp_value+"%",
                background: "#F6F6F6",
                borderRadius: "94.854px",
                height: "7px",
                position: "absolute",
                zIndex: "1",
              }
            }/>
            <div style={styles.exp_track}/>
          </div>
        </Grid>
        <Grid item xs={4.5}>
          <Typography style={styles.xp_numbers}>{`${xp}/999999`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
