import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import white_chest from '../images/chest.png';
import grey_chest from '../images/grey_chest.png';
import {claim_reward} from "./../api_calls";

import styles from './rewards_block_styles.js';

export default function REWARDS_BLOCK(props) {
  console.log(props.item_data, "reward data?");
  // const [hover_state, change_hover_state] = useState(false);

  const render_chest_image = (state) => {
    if (state) {
      return (
        <Box component="img" src={white_chest} alt="chest symbol" style={styles.chest_symbol}/>
      )
    } else {
      return (
        <Box component="img" src={grey_chest} alt="chest symbol" style={styles.chest_symbol}/>
      )
    }
  }

  const handleClaimReward =(reward_id) => {
    //loading
    props.change_loading_state(true);
    let header_verification = await props.getWithExpiration("verifyHeader");
    if (header_verification) {
      let claim = await claim_reward(header_verification, reward_id);
      //do get request for user data update.
      let retrieve_user = await props.populate_data(header_verification);
      props.handleRewardsOpen(true);
      //render rewards pop up for post claiming.
    } else {
      let sign_request = await props.sign_message();
      // setFormSubmission(true);
      let claim = await claim_reward(header_verification, reward_id);
      let retrieve_user = await props.populate_data(header_verification);
      props.handleRewardsOpen(true);
    }
  }

  return (
    <Grid container direction="row" justifyContent="space-between"
    style={props.item_data.claimed_status === "claimable" ? styles.rewards_block_container_active : styles.rewards_block_container} onClick={() => {handleClaimReward(props.items_data.id)}}
      // onMouseEnter={() => change_hover_state(true)}
      // onMouseLeave={() => change_hover_state(false)}
    >
      <Grid container item direction="row" justifyContent="space-between" alignItems="center" sx={{width: "100%"}}>
        <Grid container item direction="column" justifyContent="space-between" xs={1}>
          <Typography style={ props.item_data.claimed_status === "claimable" ? styles.name : styles.name_inactive}>LVL</Typography>
          <Typography style={ props.item_data.claimed_status === "claimable" ? styles.name : styles.name_inactive}>{props.item_data.requiredLevel}</Typography>
        </Grid>
        <Grid container item xs={6} alignItems="flex-start" sx={
          { overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            textAlign: "left",
            height: "100%",
          }
        }>
          <Typography style={props.item_data.claimed_status === "claimable" ? styles.title : styles.name_inactive}>{props.item_data.name}</Typography>
        </Grid>
        <Grid container item xs={1}>
          {render_chest_image(props.item_data.claimed_status === "claimable")}
        </Grid>
      </Grid>
    </Grid>
  );
}

// sx={[{'&:hover': {border: "0.9px solid #F9F9F9 !important"}}]}
