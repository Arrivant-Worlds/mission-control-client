import React, { useState, useEffect, memo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import laurel_1 from '../images/laurel_1.png';
import laurel_2 from '../images/laurel_2.png';
import laurel_3 from '../images/laurel_3.png';
import passport_symbol from '../images/default_passport_symbol.png';
import styles from './leader_block_styles.js';

export const LEADER_BLOCK = (props) => {
  const laurel_render = () => {
    if (props.rank === 0) {
      return (
        <Box component="img" src={laurel_1} alt="laurel_symbol"/>
      )
    } else if (props.rank === 1) {
      return (
        <Box component="img" src={laurel_2} alt="laurel_symbol"/>
      )
    } else if (props.rank === 2) {
      return (
        <Box component="img" src={laurel_3} alt="laurel_symbol"/>
      )
    } else if(props.rank === 50){
      <Typography style={styles.rank_number}></Typography>
    }
     else {
      return (
        <Typography style={styles.rank_number}>{props.rank + 1}</Typography>
      )
    }
  }

  return (
    <Grid container direction="row" justifyContent="space-between"
      style={props.item_data.user_name === props.user_data.discord_name ? styles.leader_block_container_active : styles.leader_block_container}
      sx={[{'&:hover': {background:"rgba(230, 177, 184, .4)"}}]}
    >
      <Grid container item direction="row" justifyContent="space-between" alignItems="center" sx={{width: "100%"}}>
        <Grid container item direction="row" style={styles.laurel_container} justifyContent="space-between" xs={4}>
          <Grid container item xs={6} justifyContent="flex-start">
            {laurel_render()}
          </Grid>
          <Grid container item xs={6} justifyContent="flex-start">
            <Box component="img"
            src={props.item_data.badge_url ?
              props.item_data.badge_url : passport_symbol}
              alt="passport symbol" style={styles.passport_symbol}/>
          </Grid>
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
          <Typography style={styles.name}>{props.item_data.user_name}</Typography>
        </Grid>
        <Grid container item xs={4} sx={
          { overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            textAlign: "left",
          }
        }>
          <Typography style={styles.number}>{props.item_data.user_points}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(LEADER_BLOCK);
