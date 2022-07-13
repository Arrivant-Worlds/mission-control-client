import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CONNECT_TWITTER from "./connect_twitter.js";
import {
  submit_email,
  auth_twitter,
  get_twitter_oauth_redirect,
  verify_twitter,
} from "./../api_calls";

export default function ACTION_COMPONENT(props) {

  console.log("oosoosoa", props.rewards_dialog_data)
  console.log("not asdkaoSD", props.dialog_data)
  const helper_style = {
    backgroundColor: "rgba(13, 13, 13, 0.9)",
    marginTop: "0px",
    marginRight: "0px",
    marginLeft: "0px",
    paddingTop: "3px",
    paddingLeft: "14px",
    paddingRight: "14px",
  };
  // console.log(props.action_data,"action data!");
  console.log(props.rewards_dialog_data, "rewards dialxog data");
  console.log(props.dialog_data, "dialog data");

  const [formValue, setFormValue] = useState("");
  const [formSubmission, setFormSubmission] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [helperText, setHelperText] = useState(" ");

  const disabled_button = () => {
    //need to add or for when a user has claimed 2 for a day already.
    if (props.dialog_data.user_quest_status === "Locked") {
      return true;
    } else {
      return false;
    }
  };
  const handleLinkClick = (path) => {
    props.setActionDone(true);
    window.open(path);
  };

  const handleRewardClaim = () => {
    //open rewards dialog
    // console.log(props.dialog_data, "dialog data");
    props.set_rewards_dialog_data({
      xp: props.dialog_data.xp,
<<<<<<< Updated upstream
      id: props.dialog_data.active_reward.id
=======
      id: props.dialog_data.id,
>>>>>>> Stashed changes
    });
    props.handleRewardsOpen();
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormValue(value);
  };

  const handleTwitterClick = () => {
    props.setActionDone(true);
    props.handleTwitterButton();
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    let emailForm = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (emailForm.test(formValue)) {
      setErrorState(false);
      setHelperText(" ");
      let header_verification = await props.getWithExpiration("verifyHeader");
      if (header_verification) {
        setFormSubmission(true);
        props.setActionDone(true);
        let email_submission = await submit_email(
          header_verification,
          formValue
        );
      } else {
        let sign_request = await props.sign_message();
        setFormSubmission(true);
        props.setActionDone(true);
        let email_submission = await submit_email(sign_request, formValue);
      }
    } else {
      setErrorState(true);
      setHelperText("Incorrect email format");
    }
  };

  const type_render = () => {
    if (props.dialog_data.active_reward) {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", width: "100%" }}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="flex-start"
            sx={{ height: "100%", width: "100%", padding: "10px" }}
          >
            <Typography sx={{ fontWeight: "700" }}>VERIFIED!</Typography>
            <Typography>
              Your submission has been verified! Click the button below to claim
              your reward.
            </Typography>
            <Button
              variant="contained"
              disabled={disabled_button()}
              onClick={() => handleRewardClaim()}
              sx={{
                color: "black",
                fontSize: "14px",
                width: "100%",
                fontWeight: "700",
                backgroundColor: "#F6F6F6",
              }}
            >
              CLAIM REWARD
            </Button>
          </Grid>
        </Grid>
      );
    } else if (props.action_data.type === "link") {
      return (
        <Grid
          sx={{ height: "100%", width: "100%" }}
          container
          direction="column"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography>{props.action_data.message}</Typography>
          <Button
            variant="contained"
            disabled={disabled_button()}
            onClick={() => handleLinkClick(props.action_data.url)}
            sx={{
              color: "black",
              fontSize: "14px",
              fontWeight: "700",
              backgroundColor: "#F6F6F6",
            }}
          >
            PLACEHOLDER
          </Button>
        </Grid>
      );
    } else if (props.action_data.type === "form") {
      return (
        <Grid
          sx={{ height: "100%", width: "100%" }}
          container
          justifyContent="center"
          alignItems="center"
        >
          {formSubmission ? (
            <Typography>Thanks!</Typography>
          ) : (
            <Typography sx={{ width: "80%" }}>
              {props.action_data.message}
            </Typography>
          )}
          {formSubmission ? null : (
            <form
              onSubmit={handleEmailSubmit}
              style={{
                height: "80%",
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                variant="outlined"
                name="email"
                label="email"
                type="text"
                error={errorState}
                helperText={helperText}
                FormHelperTextProps={{ style: helper_style }}
                value={formValue}
                onChange={handleInputChange}
                sx={{
                  caretColor: "#F6F6F6",
                  background: "rgba(106, 106, 106, 0.3)",
                  width: "80%",
                  input: {
                    color: "#F6F6F6",
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={disabled_button()}
                type="submit"
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "700",
                  backgroundColor: "#F6F6F6",
                }}
              >
                Submit
              </Button>
            </form>
          )}
        </Grid>
      );
    } else if (props.action_data.type === "message") {
      <Typography>{props.action_data.message}</Typography>;
    } else if (props.action_data.type === "linkTwitter") {
      //twitter oauth component
      return (
        <Grid
          sx={{ height: "100%", width: "100%" }}
          container
          direction="column"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography>{props.action_data.message}</Typography>
          <CONNECT_TWITTER
            disabled={disabled_button()}
            variant="contained"
            style={{
              color: "black",
              fontSize: "14px",
              fontWeight: "700",
              backgroundColor: "#F6F6F6",
            }}
            handleButtonHover={() => props.handleOnDialogHover()}
            handleButtonClick={() => handleTwitterClick()}
            getWithExpiration={props.getWithExpiration}
          />
        </Grid>
      );
    }
  };

  return <Box sx={{ height: "100%" }}>{type_render()}</Box>;
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
