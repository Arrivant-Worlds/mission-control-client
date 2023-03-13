import React, { useState, useEffect, memo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SimpleBar from 'simplebar-react';
import Box from '@mui/material/Box';
import styles from './leaderboard_styles';
import LEADER_BLOCK from "./leader_block";
import { LeaderboardResponse, userResponseDTO } from 'interfaces';

interface LeaderboardComponentProps {
  leaderboard_data: LeaderboardResponse;
  user_data: userResponseDTO;
}

export const LEADERBOARD = (props: LeaderboardComponentProps)=> {
  return (
    <Box style={styles.leader_board_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.leader_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          {/* @ts-ignore */}
          <Typography style={styles.leader_title}>LEADERBOARD</Typography>
        </Grid>
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          {/* @ts-ignore */}
    <Typography style={styles.leader_counter_text}>Legion missions claimed</Typography>
    <Typography style={styles.leader_counter}>{props.leaderboard_data.claimStats}</Typography>
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
          {/*  @ts-ignore */}
          <Box style={styles.content_container}
          >
            {
              props.leaderboard_data.userStats.map((item, i) => {
                return (
                  <LEADER_BLOCK item_data={item} user_data={props.user_data} key={i} rank={i}/>
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
