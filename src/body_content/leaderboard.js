import React, { useState, useEffect, memo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SimpleBar from 'simplebar-react';
import Box from '@mui/material/Box';
import styles from './leaderboard_styles.js';
import LEADER_BLOCK from "./leader_block.js";

export const LEADERBOARD = (props)=> {
  // console.log(props.leaderboard_data, "leaderboard data");
  return (
    <Box style={styles.leader_board_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.leader_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          <Typography style={styles.leader_title}>LEADERBOARD</Typography>
        </Grid>
        <Box style={styles.hr}/>
        <Grid container item direction="row" justifyContent="space-between" alignItems="center"
          style={styles.category_container}
        >
          <Grid container item xs={4} justifyContent="flex-start">
            <Typography style={styles.leader_categories}>Rank</Typography>
          </Grid>
          <Grid container item xs={3} justifyContent="flex-start">
            <Typography style={styles.leader_categories}>Player</Typography>
          </Grid>
          <Grid container item xs={4} justifyContent="flex-start">
            <Typography style={styles.leader_categories}>Total Points</Typography>
          </Grid>
        </Grid>
        <SimpleBar style={{ height: '493px', width: "100%" }}>
          <Box style={styles.content_container}
          >
            {
              props.leaderboard_data.map((item, i) => {
                return (
                  <LEADER_BLOCK item_data={item} key={i} rank={i}/>
                )
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
    </Box>
  );
}

export default memo(LEADERBOARD);

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
