import React, { useState, useEffect } from 'react';
import CONNECT_PAGE from './connect_page.js';
import styles from './main_page_styles.js';
import SG_logo from '../images/PE_SG_logo.png';
import ripple_diamond from '../images/ripple_diamond.png';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function MAIN_PAGE(props) {
  const [body_state, change_body_state] = useState('join');

  const renderSwitch = (param) => {
    switch(param) {
      case 'connect':
      return (
        <CONNECT_PAGE body_state={body_state} change_body_state={change_body_state}/>
      );
      default:
      return (
        <Grid container style={styles.grid_container} direction="column" columnSpacing={3} justifyContent="space-around" alignItems="center">
          <Typography style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia nisi neque, non tempor nibh tempor id. Donec libero urna, tempus eu ante quis, pellentesque bibendum ante.</Typography>
          <img src={SG_logo} alt="SG Logo" style={styles.logo}/>
          <div style={styles.button_container}>
            <img src={ripple_diamond} alt="diamond ripple" style={styles.ripple_diamond}/>
            <Button variant="contained" style={styles.button} onClick={() => renderSwitch("connect")}>Join Now</Button>
          </div>
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
