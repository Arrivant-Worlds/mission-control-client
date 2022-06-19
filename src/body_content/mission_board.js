import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SimpleBar from 'simplebar-react';
import styles from './mission_board_styles.js';
import MISSION_BLOCK from "./mission_block.js";
import plus from "../images/plus.png";
import minus from "../images/minus.png";
import mission_data from "./mission_data.js";
import weekly_mission_data from "./weekly_mission_data.js";
import prime_mission_data from "./prime_mission_data.js";


export default function MISSION_BOARD(props) {
  const [expanded_tab, change_expanded_tab] = useState("daily");

  const handleClick = (tab) => {
    change_expanded_tab(tab);
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
        <SimpleBar style={ expanded_tab === "daily" ? { height: '395px', width: "100%" } : styles.hidden}>
          <div style={expanded_tab === "daily" ? styles.content_container : styles.hidden}
          >
            {
              mission_data.map((item, i) => {
                return (
                  <MISSION_BLOCK item_data={item} key={i}/>
                )
              })
            }
          </div>
        </SimpleBar>
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
        <SimpleBar style={ expanded_tab === "weekly" ? { height: '395px', width: "100%" } : styles.hidden}>
          <div style={expanded_tab === "weekly" ? styles.content_container : styles.hidden}
          >
            {
              weekly_mission_data.map((item, i) => {
                return (
                  <MISSION_BLOCK item_data={item} key={i}/>
                )
              })
            }
          </div>
        </SimpleBar>
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
        <SimpleBar style={ expanded_tab === "prime" ? { height: '395px', width: "100%" } : styles.hidden}>
          <div style={expanded_tab === "prime" ? styles.content_container : styles.hidden}
          >
            {
              prime_mission_data.map((item, i) => {
                return (
                  <MISSION_BLOCK item_data={item} key={i}/>
                )
              })
            }
          </div>
        </SimpleBar>
      </Grid>
    </div>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
