import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './bounty_page_styles.js';

export default function BOUNTY_PAGE(props) {
  const [tab1_value, tab1_setValue] = useState(0);
  const [tab2_value, tab2_setValue] = useState(0);

  const handleChange = (event, newValue) => {
    if (event.target.id === "tab0" || event.target.id === "tab1") {
      tab1_setValue(newValue);
    } else {
      tab2_setValue(newValue);
    }
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        aria-labelledby={`tab${index}`}
        {...other}
      >
        {value === index && (
          <Grid>
            <Typography>{children}</Typography>
          </Grid>
        )}
      </div>
    );
  }

  const a11yProps = (index) => {
    return {
      id: `tab${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleClick = (state) => {
    props.change_body_state(state);
  }

  return (
    <Grid container style={styles.bounty_container} justifyContent="space-around" alignItems="center">
      <Grid container item direction="column" justifyContent="center" alignItems="center" xs={4}>
        <Tabs
          value={tab1_value}
          onChange={handleChange}
          textColor="primary"
        >
          <Tab label="MISSIONS" {...a11yProps(0)}/>
          <Tab label="LEADERBOARD" {...a11yProps(1)}/>
        </Tabs>
        <TabPanel value={tab1_value} index={0}>
          MISSION ITEMS
        </TabPanel>
        <TabPanel value={tab1_value} index={1}>
          LEADERBOARD ITEMS
        </TabPanel>
      </Grid>
      <Grid container item xs={3}>
        <div style={styles.center_panel_container}>
        rounded square
        </div>
      </Grid>
      <Grid container item direction="column" justifyContent="space_around" alignItems="center" xs={3}>
        <Tabs
          value={tab2_value}
          onChange={handleChange}
          textColor="primary"
        >
          <Tab label="REWARDS" {...a11yProps(2)}/>
          <Tab label="EGG" {...a11yProps(3)}/>
        </Tabs>
        <TabPanel value={tab2_value} index={0}>
          REWARDS PANEL
        </TabPanel>
        <TabPanel value={tab2_value} index={1}>
          EGG PANEL
        </TabPanel>
      </Grid>
    </Grid>
  );
}
