import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MISSION_BOARD from './mission_board.js';
import LEADERBOARD from './leaderboard.js';
import REWARDS from './rewards.js';
import EGG from './egg.js';
import PASSPORT from './passport.js';
import {get_user, get_quests, get_rewards, get_leaderboard} from "./../api_calls";
import bounty_frame from '../images/bounty_frame.png';
import styles from './bounty_page_styles.js';

export default function BOUNTY_PAGE(props) {
  const [tab1_value, tab1_setValue] = useState(0);
  const [tab2_value, tab2_setValue] = useState(0);
  const [expanded_tab, change_expanded_tab] = useState("daily");
  const [user_data, change_user_data] = useState({});
  const [quests_data, change_quests_data] = useState([]);
  const [leaderboard_data, change_leaderboard_data] = useState([]);
  const [rewards_data, change_rewards_data] = useState([]);

  useEffect(() => {
    async function getUser() {
      let user = get_user(props.wallet_data);
      let leaderboard = get_leaderboard(props.wallet_data);
      let quests = get_quests(props.wallet_data);
      let rewards = get_rewards(props.wallet_data);

      let userData = await user;
      let leaderboardData = await leaderboard;
      let questsData = await quests;
      let rewardsData = await rewards;

      // console.log(userData, "user");
      change_user_data(userData);
      // console.log(leaderboardData, "leaderboard");
      change_leaderboard_data(leaderboardData);
      // console.log(questsData, "quests");
      change_quests_data(questsData);
      // console.log(rewardsData, "rewards");
      change_rewards_data(rewardsData);
    }
    getUser();
    //change to props.exp etc.
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
            <MISSION_BOARD expanded_tab={expanded_tab} change_expanded_tab={change_expanded_tab} quests_data={quests_data} handleDialogOpen={props.handleDialogOpen} handleDialogClose={props.handleDialogClose} dialog_data={props.dialog_data} change_dialog_data={props.change_dialog_data}/>
          </TabPanel>
          <TabPanel value={tab1_value} index={1} style={styles.tab_content_container}>
            <LEADERBOARD leaderboard_data={leaderboard_data}/>
          </TabPanel>
        </Grid>
        <Grid container item xs={4} justifyContent="center" alignItems="center">
          <div style={styles.center_panel_container}>
            <PASSPORT user_data={user_data}/>
          </div>
        </Grid>
        <Grid container item direction="column" justifyContent="center" alignItems="center" xs={4}>
          <TabPanel value={tab2_value} index={0} style={styles.tab_content_container}>
            <REWARDS rewards_data={rewards_data}/>
          </TabPanel>
          <TabPanel value={tab2_value} index={1} style={styles.tab_content_container}>
            <EGG/>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
}
