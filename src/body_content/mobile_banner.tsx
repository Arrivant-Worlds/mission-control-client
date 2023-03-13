import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import background from "../images/MissionControl_HQ_background.jpg";
import mission_control_logo from "../images/mission_control_logo.png";

export default function MOBILE_BANNER() {

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center"
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundImage: `url(${background})`,
      }}
    >
      <Grid container direction="column" justifyContent="space-between" alignItems="center"
        sx={{height: "30%"}}>
        <Box sx={{width: "284px", height: "52px", background: "rgba(33, 33, 33, 0.9)", borderRadius: "5px"}}>
          <Typography>PLEASE VISIT MISSION CONTROL
          ON YOUR DESKTOP</Typography>
        </Box>
        <Box component="img" src={mission_control_logo} alt="mission control logo"/>
      </Grid>
    </Grid>
  );
}
