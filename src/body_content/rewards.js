import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SimpleBar from 'simplebar-react';
import styles from './rewards_styles.js';
import rewards_data from "./rewards_data.js";
import REWARDS_BLOCK from "./rewards_block.js";

export default function REWARDS(props) {

  return (
    <div style={styles.rewards_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.rewards_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          <Typography style={styles.rewards_title}>REWARDS</Typography>
        </Grid>
        <div style={styles.hr}/>
        <SimpleBar style={{height: '535px', width: "100%"}}>
          <div style={styles.content_container}
          >
            {
              rewards_data.map((item, i) => {
                return (
                  <REWARDS_BLOCK item_data={item} key={i}/>
                )
              })
            }
          </div>
        </SimpleBar>
      </Grid>
    </div>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
