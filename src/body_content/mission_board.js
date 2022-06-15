import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styles from './mission_board_styles.js';

export default function MISSION_BOARD(props) {
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
      <Grid container item direction="column" justifyContent="flex-start" style={styles.mission_grid_container}>
        <Grid container item direction="row" justifyContent="space-between">
          <Typography component={"div"} variant={"body2"}>Daily Missions</Typography>
          <Typography onClick={() => handleClick("daily")} component={"div"} variant={"body2"}>
            {expanded_tab === "daily" ? "-" : "+"}</Typography>
        </Grid>
          <div style={expanded_tab === "daily" ? styles.hr : styles.hidden}/>
          <div style={expanded_tab === "daily" ? styles.content_container : styles.hidden}>
            <div style={styles.test}>hello</div>
          </div>
      </Grid>
      <Grid container item direction="column" justifyContent="space-between">
        <Grid container item direction="row" justifyContent="space-between">
          <Typography component={"div"} variant={"body2"}>Weekly Missions</Typography>
          <Typography onClick={() => handleClick("weekly")} component={"div"} variant={"body2"}>
            {expanded_tab === "weekly" ? "-" : "+"}</Typography>
        </Grid>
        <div style={expanded_tab === "weekly" ? styles.hr : styles.hidden}/>
      </Grid>
      <Grid container item direction="column" justifyContent="space-between">
        <Grid container item direction="row" justifyContent="space-between">
          <Typography component={"div"} variant={"body2"}>Prime Missions</Typography>
          <Typography onClick={() => handleClick("prime")} component={"div"} variant={"body2"}>
            {expanded_tab === "prime" ? "-" : "+"}</Typography>
        </Grid>
        <div style={expanded_tab === "prime" ? styles.hr : styles.hidden}/>
      </Grid>
    </div>
  );
}
