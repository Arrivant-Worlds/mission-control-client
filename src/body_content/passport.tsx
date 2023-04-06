import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import default_passport from "../images/default_passport_symbol.png";
import lock from "../images/lock.png";
import styles from "./passport_styles";
import { MainProps } from "interfaces";

interface PassportProps {
  user_data: MainProps['user_data']
}

const PASSPORT = (props: PassportProps) => {
  const [exp_value, set_exp_value] = useState(0);
  useEffect(() => {
    let exp_percent = calculate_progress(props.user_data!.xp);
    set_exp_value(Math.round(exp_percent));
  },[]);

  const calculate_progress = (exp: number) => {
    return (100 * exp) / props.user_data!.xpToNextLevel;
  };

  const getPointFromLevelAndXP = (level: number, extraXP: number): number => {
    const base = 1000;
    let points = 0;
    if(level === 0) return 0
    for (let i = 1; i <= level; i++) {
        points = points + base + ((i - 1) * 300)
    }
    points = points + extraXP
    return points
  }
  console.log("props uu", props.user_data)
  return (
    <Grid style={styles.passport_container}>
      {/* @ts-ignore */}
      <Typography style={styles.title}>CITIZEN OF ELUÜNE</Typography>
      {/* @ts-ignore */}
      <Typography style={styles.passport}>ELUÜNE I.D.</Typography>
      {/* @ts-ignore */}
      <Typography style={styles.date}>
        issued: {props.user_data?.issued_at}
      </Typography>
      {/* @ts-ignore */}
      <Typography style={styles.date}>
        Total Missions done: {props.user_data?.missionsDone}
      </Typography>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={styles.image_container}
      >
        <Box
          component="img"
          src={props.user_data?.badgeUrl ? props.user_data?.badgeUrl : default_passport}
          alt="passport_symbol"
          style={styles.passport_image}
        />
        <Box style={styles.hr} />
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={styles.decoder_container}
        >
          {props.user_data?.visaStatus ? null : (
            <Box
              component="img"
              src={lock}
              alt="lock image"
              style={
                props.user_data?.visaStatus ? styles.hidden : styles.lock_image
              }
            />
          )}
      {/* @ts-ignore */}
          <Typography style={styles.decoder_text}>
            {props.user_data?.visaStatus ? props.user_data.visaStatus : "Locked"}
          </Typography>
        </Grid>
      </Grid>
      {/* @ts-ignore */}
      <Typography style={styles.survival_text}>Citizen Status</Typography>
      {/* @ts-ignore */}
      <Typography style={styles.assessment_text}>
        {props.user_data?.citizenStatus}
      </Typography>
      <Box style={styles.hr} />
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        style={styles.XP_container}
      >
        <Grid item xs={2.5}>
          <Typography
            style={styles.rank_text}
          >{`LVL ${props.user_data?.level}`}</Typography>
        </Grid>
        <Grid container item xs sx={{ position: "relative" }}>
      {/* @ts-ignore */}
          <Box style={styles.progress_container}>
            <Box
              style={{
                width: exp_value + "%",
                background: "#F6F6F6",
                borderRadius: "94.854px",
                height: "7px",
                position: "absolute",
                zIndex: "1",
              }}
            />
            <Box style={styles.exp_track} />
          </Box>
        </Grid>
        <Grid item xs={4.5}>
          <Typography
          //@ts-ignore
            style={styles.xp_numbers}
          >{`${props.user_data?.xp}/${props.user_data?.xpToNextLevel}`}</Typography>
        </Grid>
        <Typography sx={{
          textAlign: "left",
          fontStyle: "normal",
          fontWeight: "400",
          
          fontSize: "12px",
          lineHeight: "140%",
          color: "#F6F6F6"}}>
          {
            `TOTAL XP:${getPointFromLevelAndXP(props.user_data!.level, props.user_data!.xp)}`
          }
      </Typography>
      </Grid>

    </Grid>
  );
};

export default memo(PASSPORT);
