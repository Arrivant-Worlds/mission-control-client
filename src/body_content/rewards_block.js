import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import white_chest from '../images/chest.png';
import grey_chest from '../images/grey_chest.png';
import styles from './rewards_block_styles.js';

export default function REWARDS_BLOCK(props) {
  const [hover_state, change_hover_state] = useState(false);

  const render_chest_image = (state) => {
    if (state) {
      return (
        <img src={white_chest} alt="chest symbol" style={styles.chest_symbol}/>
      )
    } else {
      return (
        <img src={grey_chest} alt="chest symbol" style={styles.chest_symbol}/>
      )
    }
  }

  return (
    <Grid container direction="row" justifyContent="space-between" style={styles.rewards_block_container}
      sx={[{'&:hover': {border: "0.9px solid #F9F9F9 !important"}}]}
      onMouseEnter={() => change_hover_state(true)}
      onMouseLeave={() => change_hover_state(false)}
    >
      <Grid container item direction="row" justifyContent="space-between" alignItems="center" sx={{width: "100%"}}>
        <Grid container item direction="column" justifyContent="space-between" xs={1}>
          <Typography style={ hover_state ? styles.name : styles.name_inactive}>{props.item_data.xp}</Typography>
          <Typography style={ hover_state ? styles.name : styles.name_inactive}>xp</Typography>
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
          <Typography style={hover_state ? styles.name : styles.name_inactive}>{props.item_data.name}</Typography>
        </Grid>
        <Grid container item xs={1}>
          {render_chest_image(hover_state)}
        </Grid>
      </Grid>
    </Grid>
  );
}
