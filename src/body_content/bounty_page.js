import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import MISSION_BOARD from './mission_board.js';
import LEADERBOARD from './leaderboard.js';
import REWARDS from './rewards.js';
import EGG from './egg.js';
import PASSPORT from './passport.js';
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import {get_user, get_quests, get_rewards, get_leaderboard} from "./../api_calls";
import bounty_frame from '../images/bounty_frame.png';
import styles from './bounty_page_styles.js';

export default function BOUNTY_PAGE(props) {
  const { wallet, signMessage, publicKey, connect, connected, disconnect } = useWallet();
  let navigate = useNavigate();
  const [tab1_value, tab1_setValue] = useState(0);
  const [tab2_value, tab2_setValue] = useState(0);
  const [expanded_tab, change_expanded_tab] = useState("prime");

  useEffect(() => {
    const check_sig = async () => {
      let check_headers = await props.getWithExpiration("verifyHeader");
      if (!wallet || !connected || !check_headers) {
        navigate('/connect');
      } else if (wallet && connected && check_headers) {
        let gather_data = props.populate_data(check_headers);
      }
    }
    check_sig();
  }, []);

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
      <Box
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
      </Box>
    );
  }

  const a11yProps = (index) => {
    return {
      id: `tab${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
      style: styles.tab_label,
      sx: [
            {
              color: "#AAAAAA",
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
    <Box style={styles.tab_label_container}>
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
          <Box style={styles.bottom_border}></Box>
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
          <Box style={styles.bottom_border}></Box>
        </Grid>
      </Grid>
      <Grid container style={container_style_combined} justifyContent="space-between" alignItems="center">
        <Grid container item direction="column" justifyContent="center" alignItems="center" xs={4}>
          <TabPanel value={tab1_value} index={0} style={styles.tab_content_container}>
            <MISSION_BOARD expanded_tab={expanded_tab} change_expanded_tab={change_expanded_tab} quests_data={props.quests_data} handleDialogOpen={props.handleDialogOpen} handleDialogClose={props.handleDialogClose} dialog_data={props.dialog_data} change_dialog_data={props.change_dialog_data}/>
          </TabPanel>
          <TabPanel value={tab1_value} index={1} style={styles.tab_content_container}>
            <LEADERBOARD leaderboard_data={props.leaderboard_data}/>
          </TabPanel>
        </Grid>
        <Grid container item xs={4} justifyContent="center" alignItems="center">
          <Box style={styles.center_panel_container}>
            <PASSPORT user_data={props.user_data}/>
          </Box>
        </Grid>
        <Grid container item direction="column" justifyContent="center" alignItems="center" xs={4}>
          <TabPanel value={tab2_value} index={0} style={styles.tab_content_container}>
            <REWARDS rewards_data={props.rewards_data} user_data={props.user_data}/>
          </TabPanel>
          <TabPanel value={tab2_value} index={1} style={styles.tab_content_container}>
            <EGG/>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
}
