import React, { useState, useEffect, memo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SimpleBar from 'simplebar-react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styles from './rewards_styles';
import REWARDS_BLOCK from "./rewards_block";
import { JourneyRewardTypes, MainProps, RewardsDialogData, RewardTypes } from 'interfaces.js';

const render_priority = {claimable: 1, default: 2};

interface RewardsProps {
  rewards_data: MainProps['rewards_data']
  user_data: MainProps['user_data']
  getAuthHeaders: MainProps['getAuthHeaders']
  loading_state: MainProps['loading_state']
  change_loading_state: MainProps['change_loading_state']
  rewards_dialog_data: RewardsDialogData
  set_rewards_dialog_data: (data: RewardsDialogData) => void
  handleRewardsOpen: () => void
  handleRewardsClose: () => void
}

export const REWARDS = (props: RewardsProps) => {
  const render_tooltip_text = (type: JourneyRewardTypes) => {
    if (type === "soulbound" || "trait_pack") {
      return "Wallet required to claim";
    } 
    else if (type === "catch_ability") {
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
          {/* @ts-ignore*/}
          <Box style={styles.content_container}
          >
            {
              //@ts-ignore
              props.rewards_data && [...props.rewards_data].sort((a,b) => {
                if (a.claimed_status === "claimable" || b.claimed_status === "claimable") {
                  //@ts-ignore
                  return (render_priority[a.claimed_status] || render_priority.default) - (render_priority[b.claimed_status] || render_priority.default) || a.claimed_status > b.claimed_status || -(a.claimed_status < b.claimed_status);
                } else {
                  return a.requiredLevel - b.requiredLevel;
                }
              }).map((item, i) => {
                if ((item.claimed_status === "locked" && (item.rewards.type === "soulbound" ||  item.rewards.type === "trait_pack"))) {
                  return (
                    <Tooltip key={i}
                      title={render_tooltip_text(item.rewards.type)!}>
                      <Box>
                        <REWARDS_BLOCK item_data={item} key={i}
                          user_data={props.user_data}
                          set_rewards_dialog_data={props.set_rewards_dialog_data}
                          handleRewardsOpen={props.handleRewardsOpen}
                        />
                      </Box>
                    </Tooltip>
                  )
                } else {
                  return (
                    <REWARDS_BLOCK item_data={item} key={i}
                      user_data={props.user_data}
                      set_rewards_dialog_data={props.set_rewards_dialog_data}
                      handleRewardsOpen={props.handleRewardsOpen}
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
