import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import laurel_1 from '../images/laurel_1.png';
import laurel_2 from '../images/laurel_2.png';
import laurel_3 from '../images/laurel_3.png';
import passport_symbol from '../images/passport_symbol.png';
import styles from './leader_block_styles.js';

export default function LEADER_BLOCK(props) {

  const laurel_render = () => {
    if (props.item_data.rank === 1) {
      return (
        <img src={laurel_1} alt="laurel_symbol"/>
      )
    } else if (props.item_data.rank === 2) {
      return (
        <img src={laurel_2} alt="laurel_symbol"/>
      )
    } else if (props.item_data.rank === 3) {
      return (
        <img src={laurel_3} alt="laurel_symbol"/>
      )
    } else {
      return (
        <Typography style={styles.rank_number}>{props.item_data.rank}</Typography>
      )
    }
  }

  return (
    <Grid container direction="row" justifyContent="space-between" style={styles.leader_block_container}>
      <Grid container item direction="row" justifyContent="space-between" alignItems="center" sx={{width: "100%"}}>
        <Grid container item direction="row" style={styles.laurel_container} justifyContent="space-between" xs={4}>
          <Grid container item xs={6} justifyContent="flex-start">
            {laurel_render()}
          </Grid>
          <Grid container item xs={6} justifyContent="flex-start">
            <img src={passport_symbol} alt="passport symbol" style={styles.passport_symbol}/>
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
          <Typography style={styles.name}>{props.item_data.name}</Typography>
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
          <Typography style={styles.number}>{props.item_data.points}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
