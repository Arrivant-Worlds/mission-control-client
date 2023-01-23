import React, { useState, useEffect, memo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SimpleBar from 'simplebar-react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styles from './rewards_styles.js';
import REWARDS_BLOCK from "./rewards_block.js";

const render_priority = {claimable: 1, default: 2};

export const REWARDS = (props) => {

  const render_tooltip_text = (name) => {
    if (name === "Claim Soulbound") {
      return "Get to level 2 in mission control to claim";
    } else if (name === "Creature catching Ability") {
      return "Gain ability to catch creatures using Soulbound at level 2";
    }
  }
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
              [...props.rewards_data].sort((a,b) => {
                if (a.claimed_status === "claimable" || b.claimed_status === "claimable") {
                  return (render_priority[a.claimed_status] || render_priority.default) - (render_priority[b.claimed_status] || render_priority.default) || a.claimed_status > b.claimed_status || -(a.claimed_status < b.claimed_status);
                } else {
                  return a.requiredLevel - b.requiredLevel;
                }
              }).map((item, i) => {
                if ((item.claimed_status === "locked" && item.name === "Claim Soulbound") || (item.claimed_status === "locked" && item.name === "Creature catching Ability")) {
                  return (
                    <Tooltip key={i}
                      title={render_tooltip_text(item.name)}>
                      <Box>
                        <REWARDS_BLOCK item_data={item} key={i}
                          user_data={props.user_data}
                          sign_message={props.sign_message}
                          getAuthHeaders={props.getAuthHeaders} 
                          loading_state={props.loading_state} change_loading_state={props.change_loading_state} populate_data={props.populate_data}
                          rewards_dialog_data={props.rewards_dialog_data}
                          set_rewards_dialog_data={props.set_rewards_dialog_data}
                          handleRewardsOpen={props.handleRewardsOpen}
                          handleRewardsClose={props.handleRewardsClose}
                        />
                      </Box>
                    </Tooltip>
                  )
                } else {
                  return (
                    <REWARDS_BLOCK item_data={item} key={i}
                      user_data={props.user_data}
                      sign_message={props.sign_message}
                      getAuthHeaders={props.getAuthHeaders} 
                      loading_state={props.loading_state} change_loading_state={props.change_loading_state} populate_data={props.populate_data}
                      rewards_dialog_data={props.rewards_dialog_data}
                      set_rewards_dialog_data={props.set_rewards_dialog_data}
                      handleRewardsOpen={props.handleRewardsOpen}
                      handleRewardsClose={props.handleRewardsClose}
                    />
                  )
                }
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
    </Box>
  );
}

export default memo(REWARDS);
