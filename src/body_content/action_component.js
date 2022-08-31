import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import CONNECT_TWITTER from "./connect_twitter.js";
import { useAnalytics } from '../mixpanel.js';
import {
  submit_email,
  auth_twitter,
  get_twitter_oauth_redirect,
  verify_twitter,
  transmit_signed_quest_reward_tx_to_server,
} from "./../api_calls";
import { Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ACTION_COMPONENT(props) {
  console.log(props, "???? AC");
  const { track, setPropertyIfNotExists, increment, setProperty } = useAnalytics();
  const [claimed_state, change_claimed_state] = useState(false);
  const {signTransaction} = useWallet()
  const helper_style = {
    backgroundColor: "rgba(13, 13, 13, 0.9)",
    marginTop: "0px",
    marginRight: "0px",
    marginLeft: "0px",
    paddingTop: "3px",
    paddingLeft: "14px",
    paddingRight: "14px",
  };

  const [formValue, setFormValue] = useState("");
  const [nameFormValue, setNameFormValue] = useState("");
  const [formSubmission, setFormSubmission] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [helperText, setHelperText] = useState(" ");

  const disabled_button = () => {
    //need to add or for when a user has claimed 2 for a day already.
    // if (props.user_data.daily_claim_remaining === 0 && props.dialog_data.recurrence === "daily") {
    //   return true;
    // }
    if (props.dialog_data.recurrence === "permanent") {
      if (props.dialog_data.from === "mission" && props.actionDone) {
        return true;
      } else if (props.dialog_data.from === "mission") {
        return false;
      } else if (props.dialog_data.from === "log" && props.dialog_data.active_reward.length === 0) {
        return true;
      } else {
        return false;
      }
    }

    if (props.dialog_data.user_quest_status === "Locked") {
      return true;
    } else if (props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 ||  claimed_state) {
      return true;
    } else {
      return false;
    }
  };

  const handleLinkClick = (path) => {
    props.setActionDone(true);
    window.open(path);
  };

  const handleRewardClaim = async () => {
    change_claimed_state(true);
    props.playRewardFanfare();
    console.log("claiming", props.dialog_data.type)
    await props.handleClaimQuestReward(props.dialog_data.active_reward[0].id, props.dialog_data.type);
    try {
      track('Mission Claim',{
        event_category: 'Missions',
        event_label: props.dialog_data.title,
        xp: props.dialog_data.xp,
      })
      let now = new Date()
      setPropertyIfNotExists('First Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
      setProperty('Last Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
      setPropertyIfNotExists('Missions done', 0)
      increment('Missions done', 1);
    } catch(err){
      console.log("MIXPANEL ERR", err)
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormValue(value);
  };

  const handleNameInputChange = (e) => {
    const { value } = e.target;
    setNameFormValue(value);
  };

  const handleTwitterClick = () => {
    props.setActionDone(true);
    props.handleTwitterButton();
  };

  const handleReferralClick = () => {
    props.setActionDone(true);
    navigator.clipboard.writeText(props.action_data.url);
    props.setAlertState({
      open: true,
      message:
        "Referral link copied!",
      severity: "success",
    });
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    let emailForm = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (emailForm.test(formValue) && nameFormValue !== "") {
      setErrorState(false);
      setHelperText(" ");
      let header_verification = await props.getWithExpiration("verifyHeader");
      if (header_verification) {
        setFormSubmission(true);
        props.setActionDone(true);
        let email_submission = await submit_email(
          header_verification,
          formValue,
          nameFormValue
        );
      } else {
        let sign_request = await props.sign_message();
        setFormSubmission(true);
        props.setActionDone(true);
        let email_submission = await submit_email(sign_request, formValue, nameFormValue);
      }
    } else {
      setErrorState(true);
      setHelperText("Incorrect email format");
    }
  };

  const type_render = () => {
    if (props.dialog_data.recurrence === "permanent") {
      if (props.dialog_data.from === "log") {
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
              <Typography sx={{ fontWeight: "700" }}>CONGRATULATIONS!</Typography>
              <Typography sx={{fontSize: "18px", lineHeight: "25px", marginBottom: "15px"}}>
                Click the button below to claim
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
                  height: "55px",
                  fontWeight: "700",
                  backgroundColor: "#F6F6F6",
                }}
              >
                { props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 || claimed_state ? <Icon className={"fa-solid fa-check"}></Icon> : "CLAIM REWARD" }
              </Button>
            </Grid>
          </Grid>
        );
      } else {
        return (
          <Grid
            sx={{ height: "100%", width: "100%" }}
            container
            alignItems="center"
            justifyContent="center"
          >
            <Grid
              container
              direction="column"
              justifyContent="space-around"
              alignItems="flex-start"
              sx={{
                width: "90%",
                height: "100%",
              }}
            >
              <Typography sx={{fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px", width: "100%", wordWrap: "break-word"}}>{props.action_data.message}</Typography>
              <Button
                variant="contained"
                disabled={disabled_button()}
                onClick={ props.dialog_data.type === "claim_caught_creature_reward" ? () => handleLinkClick(props.action_data.url) : () => handleReferralClick(props.action_data.url)}
                sx={{
                  color: "black",
                  fontSize: "14px",
                  width: "100%",
                  height: "55px",
                  fontWeight: "700",
                  padding: "0 20px",
                  backgroundColor: "#F6F6F6",
                }}
              >
                { props.dialog_data.from === "mission" && props.actionDone ? <Icon className={"fa-solid fa-check"}></Icon> : props.action_data.buttonText }
              </Button>
            </Grid>
          </Grid>
        );
      }
    }
    if (props.dialog_data.active_reward.length > 0) {
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
            <Typography sx={{fontSize: "18px", lineHeight: "25px", marginBottom: "15px"}}>
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
                height: "55px",
                fontWeight: "700",
                backgroundColor: "#F6F6F6",
              }}
            >
              { props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 || claimed_state ? <Icon className={"fa-solid fa-check"}></Icon> : "CLAIM REWARD" }
            </Button>
          </Grid>
        </Grid>
      );
    } else if (props.action_data.type === "link") {
      return (
        <Grid
          sx={{ height: "100%", width: "100%" }}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="flex-start"
            sx={{
              width: "90%",
              height: "100%",
            }}
          >
            <Typography sx={{fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px"}}>{props.action_data.message}</Typography>
            <Button
              variant="contained"
              disabled={disabled_button()}
              onClick={() => handleLinkClick(props.action_data.url)}
              sx={{
                color: "black",
                fontSize: "14px",
                width: "100%",
                height: "55px",
                fontWeight: "700",
                padding: "0 20px",
                backgroundColor: "#F6F6F6",
              }}
            >
              { props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 ? <Icon className={"fa-solid fa-check"}></Icon> : props.action_data.buttonText }
            </Button>
          </Grid>
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
            <Typography sx={{width: "90%", fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px"}}>Check your e-mail for verification!</Typography>
          ) : (
            <Typography sx={{width: "90%", fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px"}}>
              {props.action_data.message}
            </Typography>
          )}
          {formSubmission ? null : (
            <form
              onSubmit={handleEmailSubmit}
              style={{
                height: "90%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                variant="outlined"
                name="name"
                label="name"
                type="text"
                value={nameFormValue}
                onChange={handleNameInputChange}
                sx={{
                  caretColor: "#F6F6F6",
                  background: "rgba(106, 106, 106, 0.3)",
                  width: "90%",
                  marginBottom: "15px",
                  input: {
                    color: "#F6F6F6",
                  },
                }}
              />
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
                  width: "90%",
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
                  width: "90%",
                  height: "55px",
                  fontWeight: "700",
                  backgroundColor: "#F6F6F6",
                }}
              >
                { props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 ? <Icon className={"fa-solid fa-check"}></Icon> : props.action_data.buttonText }
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
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="flex-start"
            sx={{
              width: "90%",
              height: "100%",
            }}
          >
            <Typography sx={{fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px"}}>{props.action_data.message}</Typography>
            <CONNECT_TWITTER
              disabled={disabled_button()}
              variant="contained"
              style={{
                color: "black",
                fontSize: "14px",
                width: "100%",
                height: "55px",
                fontWeight: "700",
                backgroundColor: "#F6F6F6",
                padding: "0",
              }}
              handleButtonHover={() => props.handleDialogHover()}
              handleButtonClick={() => handleTwitterClick()}
              getWithExpiration={props.getWithExpiration}
              buttonText={props.action_data.buttonText}
              handleNavigation={props.handleNavigation}
              setAlertState = {props.setAlertState}
            />
          </Grid>
        </Grid>
      );
    }
  };

  return <Box sx={{ height: "100%", padding: "15px 0px" }}>{type_render()}</Box>;
}
