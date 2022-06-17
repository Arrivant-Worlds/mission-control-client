import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styles from './leaderboard_styles.js';
import plus from "../images/plus.png";
import minus from "../images/minus.png";

export default function LEADERBOARD(props) {
  const [expanded_tab, change_expanded_tab] = useState("daily");

  const handleClick = (tab) => {
    change_expanded_tab(tab);
  }

  const render_missions = (mission_data) => {
    return (
      <div style={styles.test}>hello</div>
    )
  }

  return (
    <div style={styles.mission_board_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.mission_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between"
          onClick={() => handleClick("daily")} alignItems="center">
          <Typography style={ expanded_tab === "daily" ? styles.mission_title : styles.mission_title_not_active }>DAILY MISSIONS
          </Typography>
          <img src={expanded_tab === "daily" ? minus : plus}
          style={expanded_tab === "daily" ? styles.minus : styles.plus}/>
        </Grid>
          <div style={expanded_tab === "daily" ? styles.hr : styles.hidden}/>
          <div style={expanded_tab === "daily" ? styles.content_container : styles.hidden}>
            <div>hello</div>
          </div>
      </Grid>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.mission_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between"
        onClick={() => handleClick("weekly")} alignItems="center">
          <Typography style={styles.mission_title}
            style={ expanded_tab === "weekly" ? styles.mission_title : styles.mission_title_not_active}>WEEKLY MISSIONS
          </Typography>
          <img src={expanded_tab === "weekly" ? minus : plus}
          style={expanded_tab === "weekly" ? styles.minus : styles.plus}/>
        </Grid>
        <div style={expanded_tab === "weekly" ? styles.hr : styles.hidden}/>
        <div style={expanded_tab === "weekly" ? styles.content_container : styles.hidden}>
          <div>Weekly</div>
        </div>
      </Grid>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.mission_grid_container} sx={{marginBottom: "0px !important"}} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between"
        onClick={() => handleClick("prime")} alignItems="center">
          <Typography style={styles.mission_title}
            style={expanded_tab === "prime" ? styles.mission_title : styles.mission_title_not_active}>PRIME MISSIONS
          </Typography>
          <img src={expanded_tab === "prime" ? minus : plus}
          style={expanded_tab === "prime" ? styles.minus : styles.plus}/>
        </Grid>
        <div style={expanded_tab === "prime" ? styles.hr : styles.hidden}/>
        <div style={expanded_tab === "prime" ? styles.content_container : styles.hidden}>
          <div>prime missions</div>
        </div>
      </Grid>
    </div>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
