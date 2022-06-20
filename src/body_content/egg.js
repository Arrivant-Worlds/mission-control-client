import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SimpleBar from 'simplebar-react';
import styles from './egg_styles.js';

export default function EGG(props) {

  return (
    <div style={styles.egg_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.egg_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          <Typography style={styles.egg_title}>EGG</Typography>
        </Grid>
        <div style={styles.hr}/>
        <Grid container item direction="column" justifyContent="space-around" alignItems="center"
          style={styles.egg_content_container}
        >
        </Grid>
      </Grid>
    </div>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
