import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MISSION_BOARD from './mission_board.js';
import LEADERBOARD from './leaderboard.js';
import bounty_frame from '../images/bounty_frame.png';
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
            <Typography component={"div"} variant={"body2"}>{children}</Typography>
          </Grid>
        )}
      </div>
    );
  }

  const a11yProps = (index) => {
    return {
      id: `tab${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
      style: styles.tab_label,
      sx: [
            {
              color: "#888888",
              fontWeight: "700",
            },
            {
              '&:hover': {
                color: '#F6F6F6',
                fontWeight: "700",
                opacity: 1,
              },
            },
            {
              '&.Mui-selected': {
                color: '#F6F6F6',
              },
            },
          ]
    };
  }

  const handleClick = (state) => {
    props.change_body_state(state);
  }

  const container_style = {
    backgroundImage: `url(${bounty_frame})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    width: "87%",
  };

  const container_style_combined = {...container_style, ...styles.bounty_container};

  return (
    <div style={styles.tab_label_container}>
      <Grid container direction="row" justifyContent="space-between" sx={{marginBottom: "20px", width: "87%"}}>
        <Grid container item xs={4} style={styles.tab_label_grid}>
          <Tabs
            value={tab1_value}
            onChange={handleChange}
            textColor="primary"
            style={styles.tab_label}
            TabIndicatorProps={{style: {zIndex: 2}}}
          >
            <Tab label="MISSIONS" {...a11yProps(0)}/>
            <Tab label="LEADERBOARD" {...a11yProps(1)}/>
          </Tabs>
          <div style={styles.bottom_border}></div>
        </Grid>
        <Grid container item xs={4} style={styles.tab_label_grid_2}>
          <Tabs
            value={tab2_value}
            onChange={handleChange}
            textColor="primary"
            TabIndicatorProps={{style: {zIndex: 2}}}
          >
            <Tab label="REWARDS" {...a11yProps(2)}/>
            <Tab label="EGG" {...a11yProps(3)}/>
          </Tabs>
          <div style={styles.bottom_border}></div>
        </Grid>
      </Grid>
      <Grid container style={container_style_combined} justifyContent="space-between" alignItems="center">
        <Grid container item direction="column" justifyContent="center" alignItems="center" xs={4}>
          <TabPanel value={tab1_value} index={0} style={styles.tab_content_container}>
            <MISSION_BOARD/>
          </TabPanel>
          <TabPanel value={tab1_value} index={1} style={styles.tab_content_container}>
            <LEADERBOARD/>
            </TabPanel>
        </Grid>
        <Grid container item xs={3}>
          <div style={styles.center_panel_container}>
            rounded square
          </div>
        </Grid>
        <Grid container item direction="column" justifyContent="space_around" alignItems="center" xs={4}>
          <TabPanel value={tab2_value} index={0}>
            REWARDS PANEL
          </TabPanel>
          <TabPanel value={tab2_value} index={1}>
            EGG PANEL
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
}
