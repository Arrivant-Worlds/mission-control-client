import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const COUNTDOWN = (props) => {
  // console.log(props.user_data, "user data?");

  const calculateTimeLeft = () => {
    const difference = Math.abs(+new Date("2030-07-18T00:00:00-07:00") - +new Date());
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference % 86400000 / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });


  return (
    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
      <Typography sx={{fontSize: "14px"}}>
        {`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
      </Typography>
    </Grid>
  );
}

export default memo(COUNTDOWN);
