import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SimpleBar from 'simplebar-react';
import styles from './rewards_styles.js';
import REWARDS_BLOCK from "./rewards_block.js";

export default function REWARDS(props) {
  // console.log(props.user_data);
  // console.log(props.rewards_data);

  return (
    <Box style={styles.rewards_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.rewards_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          <Typography style={styles.rewards_title}>REWARDS</Typography>
        </Grid>
        <Box style={styles.hr}/>
        <SimpleBar style={{height: '535px', width: "100%"}}>
          <Box style={styles.content_container}
          >
            {
              props.rewards_data.map((item, i) => {
                return (
                  <REWARDS_BLOCK item_data={item} key={i} user_data={props.user_data} sign_message={props.sign_message}
                  getWithExpiration={props.getWithExpiration} loading_state={props.loading_state} change_loading_state={props.change_loading_state} populate_data={props.populate_data}
                  rewards_dialog_data={props.rewards_dialog_data}
                  set_rewards_dialog_data={props.set_rewards_dialog_data}
                  handleRewardsOpen={props.handleRewardsOpen}
                  handleRewardsClose={props.handleRewardsClose}
                  />
                )
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
    </Box>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
