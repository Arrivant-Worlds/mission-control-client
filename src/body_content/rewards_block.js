import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import chest from '../images/chest.png';
import styles from './leader_block_styles.js';

export default function REWARDS_BLOCK(props) {

  return (
    <Grid container direction="row" justifyContent="space-between" style={styles.leader_block_container}>
      <Grid container item direction="row" justifyContent="space-between" alignItems="center" sx={{width: "100%"}}>
        <Grid container item direction="row" style={styles.laurel_container} justifyContent="space-between" xs={4}>
          <Typography style={styles.name}>{props.item_data.xp}</Typography>
        </Grid>
        <Grid container item xs={3} sx={
          { overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            textAlign: "left",
          }
        }>
          <Typography style={styles.name}>{props.item_data.name}</Typography>
        </Grid>
        <Grid container item xs={1}>
          <img src={chest} alt="chest symbol" style={styles.chest_symbol}/>
        </Grid>
      </Grid>
    </Grid>
  );
}
