import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import default_passport from '../images/default_passport_symbol.png';
import lock from '../images/lock.png';
import styles from './passport_styles.js';

export default function PASSPORT(props) {
  const [exp_value, set_exp_value] = useState(0);
  //change to props.exp etc in render.
  // console.log(props.user_data, "user_data");
  useEffect(() => {
    let exp_percent = calculate_progress(99999);
    //change to props.exp etc.
    set_exp_value(Math.round(exp_percent));
  }, []);

   const calculate_progress = (exp) => {
     return (100 * props.user_data.xp) / 999999;
   }

  return (
    <Grid style={styles.passport_container}>
      <Typography style={styles.title}>ELERIAH PIONEER</Typography>
      <Typography style={styles.passport}>PASSPORT</Typography>
      <Typography style={styles.date}>issued: 06-06-22</Typography>
      <Grid container direction="column" justifyContent="center" alignItems="center" style={styles.image_container}>
        <Box component="img" src={ props.user_data.badgeUrl ? default_passport : default_passport} alt="passport_symbol" style={styles.passport_image}/>
        <Box style={styles.hr}/>
        <Grid container direction="row" justifyContent="center" alignItems="center" style={styles.decoder_container}>
          {props.user_data.badgeUrl ? null :
            <Box component="img" src={lock} alt="lock image" style={ props.user_data.badgeName ? styles.hidden : styles.lock_image }/>
          }
          <Typography style={styles.decoder_text}>
            { props.user_data.badgeName ? props.user_data.badgeName : "Locked"}
          </Typography>
        </Grid>
      </Grid>
      <Typography style={styles.survival_text}>survival assessment</Typography>
      <Typography style={styles.assessment_text}>{props.user_data.survivalAssessment}</Typography>
      <Box style={styles.hr}/>
      <Grid container direction="row" justifyContent="space-around" alignItems="center" style={styles.XP_container}>
        <Grid item xs={2.5}>
          <Typography style={styles.rank_text}>Rank XP</Typography>
        </Grid>
        <Grid container item xs sx={{position: "relative"}}>
          <Box style={styles.progress_container}>
            <Box style={
              { width: exp_value+"%",
                background: "#F6F6F6",
                borderRadius: "94.854px",
                height: "7px",
                position: "absolute",
                zIndex: "1",
              }
            }/>
            <Box style={styles.exp_track}/>
          </Box>
        </Grid>
        <Grid item xs={4.5}>
          <Typography style={styles.xp_numbers}>{`${props.user_data.xp}/999999`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
