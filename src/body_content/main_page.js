import React, { useState, useEffect } from 'react';
import JOIN_PAGE from './join_page.js';
import styles from './main_page_styles.js';
import SG_logo from '../images/PE_SG_logo.png';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function MAIN_PAGE(props) {
  const [body_state, change_body_state] = useState('join');

  const renderSwitch = (param) => {
    switch(param) {
      case 'join':
      return (
        <JOIN_PAGE/>
      );
      default:
      return (
        <Grid container style={styles.grid_container} direction="column" columnSpacing={3} justifyContent="space-around" alignItems="center">
          <Typography style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia nisi neque, non tempor nibh tempor id. Donec libero urna, tempus eu ante quis, pellentesque bibendum ante.</Typography>
          <img src={SG_logo} alt="SG Logo" style={styles.logo}/>
        </Grid>
      );
    }
  }

  return (
    <div style={styles.container}>
      {renderSwitch()}
    </div>
  );
}


// const classes = useStyles();
