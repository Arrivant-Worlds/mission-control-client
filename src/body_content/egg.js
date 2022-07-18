import React, { useState, useEffect, memo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SimpleBar from 'simplebar-react';
import Box from '@mui/material/Box';
import egg_image from '../images/egg.png';
import styles from './egg_styles.js';

export const EGG = (props) => {

  return (
    <Box style={styles.egg_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.egg_grid_container} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          <Typography style={styles.egg_title}>EGG</Typography>
        </Grid>
        <Box style={styles.hr}/>
        <Grid container item direction="column" justifyContent="space-around" alignItems="center"
          style={styles.egg_content_container}
        >
          <Grid>
            <Typography style={styles.subtitle}>
              coming soon
            </Typography>
          </Grid>
          <Grid>
            <Box component="img" src={egg_image} alt="egg_image" style={styles.egg_image}/>
          </Grid>
          <Grid>
            <Typography style={styles.text}>
              Your elerian egg is on its way. While you wait, keep collecting XP because it may be  helpful when it arrives!
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default memo(EGG);

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
