import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import styles from './mission_block_styles.js';

export default function MISSION_BLOCK(props) {

  return (
    <Grid container direction="row" justifyContent="space-between" style={styles.mission_block_container}
      sx={[{'&:hover': {border: "0.9px solid #F9F9F9 !important"}}]}
    >
      <Grid container item direction="column" xs={11}>
        <Grid container item direction="row" justifyContent="flex-start" alignItems="center">
          <Typography style={styles.title}>{props.item_data.title}</Typography>
          <Typography style={styles.xp}>{`+${props.item_data.xp} XP`}</Typography>
        </Grid>
        <Typography style={styles.description}>{props.item_data.description}</Typography>
      </Grid>
      <Grid container item xs={1} justifyContent="center" alignItems="center">
        <Icon className={props.item_data.platform === "discord"?'fa-brands fa-discord':"fa-brands fa-twitter"} style={styles.icon}></Icon>
      </Grid>
    </Grid>
  );
}
