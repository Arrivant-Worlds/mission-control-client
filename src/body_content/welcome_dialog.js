import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import styles from './welcome_dialog_styles.js';


export default function WELCOME_DIALOG(props) {
  const [page_state, set_page_state] = useState(0);

  const handleOnClick = (state) => {
    props.playQuestOpen();
    if (state === "next") {
      if (page_state === 2) {
        props.handleWelcomeClose();
        return;
      }
      set_page_state(page_state+1);
    } else {
      set_page_state(page_state-1);
    }
  };

  const handleOnClose = () => {
    props.handleWelcomeClose();
  };

  const renderContent = () => {
    if (page_state === 0) {
      return (
        <Grid>
          <Typography sx={styles.main_text}>
          {`We’re honored that you’ve chosen to become a Citizen of Eluüne.

            This place, Mission Control, will be your home base within the Project Eluüne universe.

            Here, you’ll cement your knowledge of the heroic Luüne Legion.
            Here, you’ll shape your reputation among the StarGardens. 
            Here, your journey to Eleriah begins.

            Citizen…
            Are you ready to take your first step into a new frontier?`}
          </Typography>
        </Grid>
      )
    } else if (page_state === 1) {
      return (
        <Typography sx={styles.main_text}>
          {`Now that you’ve arrived, let’s take a look around:

            Your Eluüne I.D. shows your citizen status within our community — to enhance it, you must complete missions to gather XP (Experience Points), which you’ll use to claim rewards.

            Explore the Missions panel to take on a new challenge. Visit the Leaderboard and Log panels to track your progress and collect rewards.

            Visit the main Rewards panel to exchange your earned XP and claim your Elerian rewards. The more missions you complete, the greater your rewards will be…`}
        </Typography>
      )
    } else if (page_state === 2) {
      return (
        <Typography sx={styles.main_text}>
          {`In time, you will come to understand that the more you learn about this world, the more this world will reveal to you… but Eleriah only reveals her great power to those who prove worthy.

          In preparation for the next chapter of Project Eluüne, you must prove not only to her, but to all your fellow Citizens, that you have what it takes to fulfill your calling as a Citizen of Eluüne.

          Because Only Together We Transcend.

          Citizen… It’s time for your first mission.`}
        </Typography>
      )
    }
  }

  return (
    <Dialog
      open={props.welcome_popup}
      onClose={props.handleWelcomeClose}
      BackdropProps={{
        style: {
          background: "rgba(26, 32, 38, 0.8)",
          opacity: "0.8",
        },
      }}
      PaperProps={{
        style: {
          background: "radial-gradient(143.78% 66.7% at 46.76% 50%, rgba(44, 89, 96, 0.94) 0%, #000000 100%)",
          border: "1px solid #B5CCD5",
          boxShadow: "3px 4px 47px rgba(181, 204, 213, 0.8)",
          borderRadius: "5px",
        },
      }}
    >
      <DialogContent sx={{ height: "100%" }}>
        <IconButton
          aria-label="close"
          onClick={() => props.handleWelcomeClose()}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: "#6A6A6A",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Grid container>
          <Typography sx={styles.title}>
            Welcome!
          </Typography>
          {
            renderContent()
          }
          <Grid container direction="row" justifyContent="flex-end">
            {page_state !== 0 ? <Button sx={{
              fontSize: "16px",
              backgroundColor: "transparent",
              border: "1px solid #888888",
              color: "#888888",
              borderRadius: "0px",
              width: "100px",
              marginRight: "20px"}}
              onClick={() => handleOnClick("next")} onClick={() => handleOnClick("back")}>
            Back
            </Button>
            :null}
            <Button sx={{
              fontSize: "16px",
              backgroundColor: "transparent",
              border: "1px solid #98FBFA",
              borderRadius: "0px",
              width: "100px",
              color: "#98FBFA"}}
              onClick={() => handleOnClick("next")}>
            Next
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
