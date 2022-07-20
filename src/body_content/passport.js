import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import default_passport from "../images/default_passport_symbol.png";
import lock from "../images/lock.png";
import styles from "./passport_styles.js";

const PASSPORT = (props) => {
  const [exp_value, set_exp_value] = useState(0);
  //change to props.exp etc in render.
  // console.log(props.user_data, "user_data");
  useEffect(() => {
    let exp_percent = calculate_progress(props.user_data.xp);
    // console.log(exp_percent, "????");
    //change to props.exp etc.
    set_exp_value(Math.round(exp_percent));
  });

  const calculate_progress = (exp) => {
    return (100 * exp) / props.user_data.xpToNextLevel;
  };

  return (
    <Grid style={styles.passport_container}>
      <Typography style={styles.title}>ELERIAH PIONEER</Typography>
      <Typography style={styles.passport}>ELERIAN I.D.</Typography>
      <Typography style={styles.date}>
        issued: {props.user_data.issued_at}
      </Typography>
      <Typography style={styles.date}>
        Arrival Status: {props.user_data.arrivalStatus}
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
          src={props.user_data.badgeUrl ? props.user_data.badgeUrl : default_passport}
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
          {props.user_data.visaStatus ? null : (
            <Box
              component="img"
              src={lock}
              alt="lock image"
              style={
                props.user_data.visaStatus ? styles.hidden : styles.lock_image
              }
            />
          )}
          <Typography style={styles.decoder_text}>
            {props.user_data.visaStatus ? props.user_data.visaStatus : "Locked"}
          </Typography>
        </Grid>
      </Grid>
      <Typography style={styles.survival_text}>Citizen Status</Typography>
      <Typography style={styles.assessment_text}>
        {props.user_data.citizenStatus}
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
          >{`LVL ${props.user_data.level}`}</Typography>
        </Grid>
        <Grid container item xs sx={{ position: "relative" }}>
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
            style={styles.xp_numbers}
          >{`${props.user_data.xp}/${props.user_data.xpToNextLevel}`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(PASSPORT);

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
