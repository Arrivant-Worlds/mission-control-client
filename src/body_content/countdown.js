import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const COUNTDOWN = (props) => {

  const calculateTimeLeft = () => {
    const difference = Math.abs(+new Date("2030-07-18T00:00:00+0000") - +new Date());
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
        {`${timeLeft.hours < 10 ? "0"+timeLeft.hours : timeLeft.hours}:${timeLeft.minutes < 10 ? "0"+timeLeft.minutes : timeLeft.minutes}:${timeLeft.seconds < 10 ? "0"+timeLeft.seconds : timeLeft.seconds}`}
      </Typography>
    </Grid>
  );
}

export default memo(COUNTDOWN);
