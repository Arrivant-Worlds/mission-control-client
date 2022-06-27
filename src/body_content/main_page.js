import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CONNECT_PAGE from './connect_page.js';
import CONNECT_WALLET from './connect_wallet.js';
import BOUNTY_PAGE from './bounty_page.js';
import MISSION_DIALOG from './mission_dialog.js';
import Box from '@mui/material/Box';
import { Typewriter, useTypewriter, Cursor } from 'react-simple-typewriter';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SG_logo from '../images/PE_SG_logo.png';
import ripple_diamond from '../images/ripple_diamond.png';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styles from './main_page_styles.js';

export default function MAIN_PAGE(props) {
  let navigate = useNavigate();
  // const [body_state, change_body_state] = useState('join');
  const [wallet_data, change_wallet_data] = useState({});
  const [dialog_state, change_dialog_state] = useState(false);
  const [dialog_data, change_dialog_data] = useState({
    test: "meow mix",
  });

  // useEffect(() => {
  //   let path_split = window.location.pathname.split("/");
  //   console.log(window.location.pathname, "path?");
  //   console.log(path_split, "path split");
  //   change_body_state("/"+path_split[1]);
  // });
  // console.log(window.location.pathname, "pathname?");
  const handleClick = (path) => {
    navigate(`${path}`);
  }

  const handleDialogOpen = () => {
    // console.log("firing?? in main open");
    change_dialog_state(true);
  };

  const handleDialogClose = () => {
    change_dialog_state(false);
  };

  // const renderSwitch = (param) => {
  //   switch(param) {
  //     case 'connect':
  //       return (
  //         <CONNECT_PAGE body_state={body_state} change_body_state={change_body_state}/>
  //       );
  //     case 'connect_wallet':
  //       return (
  //         <CONNECT_WALLET body_state={body_state} change_body_state={change_body_state}
  //         wallet_data={wallet_data} change_wallet_data={change_wallet_data}/>
  //       );
  //     case 'bounty_main':
  //       return (
  //         <BOUNTY_PAGE body_state={body_state} change_body_state={change_body_state} handleDialogOpen={handleDialogOpen} handleDialogClose={handleDialogClose}
  //         wallet_data={wallet_data} dialog_data={dialog_data} change_dialog_data={change_dialog_data}/>
  //       );
  //     default:
  //       return (
  //         <Grid container style={styles.grid_container}
  //         direction="column"
  //         justifyContent="center" alignItems="center">
  //           <Grid item xs={4} alignItems="center" justifyContent="center">
  //             <Box style={{
  //               textTransform: "uppercase",
  //               margin: "-20px auto 0 auto",
  //               fontSize: "18px",
  //               width: "60%",
  //               color: "#F6F6F6"}}>
  //               <Typewriter
  //                 loop={1}
  //                 deleteSpeed={0}
  //                 words={['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia nisi neque, non tempor nibh tempor id. Donec libero urna, tempus eu ante quis, pellentesque bibendum ante.']}
  //                 cursor
  //                 cursorStyle='_'
  //                 typeSpeed={70}
  //                 delaySpeed={500}
  //               />
  //             </Box>
  //           </Grid>
  //           <Grid item xs={2}>
  //             <Box src={SG_logo} alt="SG Logo" style={styles.logo}/>
  //           </Grid>
  //           <Grid container item justifyContent="center" alignItems="center" xs={1}>
  //             <Box style={styles.button_container}>
  //               <Box src={ripple_diamond} alt="diamond ripple" style={styles.ripple_diamond}/>
  //               <Button variant="contained" style={styles.button} onClick={() => handleClick("connect")}>JOIN NOW</Button>
  //             </Box>
  //           </Grid>
  //         </Grid>
  //       );
  //   }
  // }

  const bounty_overlay_css = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg, #15181B -16.28%, rgba(21, 24, 27, 0) 36.97%)",
  }

  return (
    <Box style={window.location.pathname === "/bounty_main" ? bounty_overlay_css : styles.container}>
      <Routes>
        <Route index element={<Grid container style={styles.grid_container}
        direction="column"
        justifyContent="center" alignItems="center">
          <Grid item xs={4} alignItems="center" justifyContent="center">
            <Box sx={{
              textTransform: "uppercase",
              margin: "-20px auto 0 auto",
              fontSize: "18px",
              width: "60%",
              color: "#F6F6F6",
              '@media screen and (min-width: 2400px)': {
                  fontSize: "30px",
                },
              }}>
              <Typewriter
                loop={1}
                deleteSpeed={0}
                words={['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia nisi neque, non tempor nibh tempor id. Donec libero urna, tempus eu ante quis, pellentesque bibendum ante.']}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                delaySpeed={500}
              />
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box component="img" src={SG_logo} alt="SG Logo" style={styles.logo}/>
          </Grid>
          <Grid container item justifyContent="center" alignItems="center" xs={1}>
            <Box style={styles.button_container}>
              <Box component="img" src={ripple_diamond} alt="diamond ripple" style={styles.ripple_diamond}/>
              <Button variant="contained" style={styles.button} onClick={() => handleClick("/connect")}>JOIN NOW</Button>
            </Box>
          </Grid>
        </Grid>} />
        <Route path="connect"
          element={<CONNECT_PAGE/>}/>
        <Route path="connect_wallet" element={<CONNECT_WALLET
        wallet_data={wallet_data} change_wallet_data={change_wallet_data}/>}/>
        <Route path="bounty_main" element={<BOUNTY_PAGE handleDialogOpen={handleDialogOpen} handleDialogClose={handleDialogClose}
        wallet_data={wallet_data} dialog_data={dialog_data} change_dialog_data={change_dialog_data}/>}/>
      </Routes>
      <MISSION_DIALOG handleDialogClose={handleDialogClose} handleDialogOpen={handleDialogOpen}       dialog_state={dialog_state} change_dialog_state={change_dialog_state} dialog_data={dialog_data} change_dialog_data={change_dialog_data}/>
    </Box>
  );
}
