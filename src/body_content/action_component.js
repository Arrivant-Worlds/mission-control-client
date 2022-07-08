import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import CONNECT_TWITTER from "./connect_twitter.js";
import {submit_email, auth_twitter,
  get_twitter_oauth_redirect,
  verify_twitter} from "./../api_calls";


export default function ACTION_COMPONENT(props) {
  const helper_style = {
    backgroundColor: "rgba(13, 13, 13, 0.9)",
    marginTop: "0px",
    marginRight: "0px",
    marginLeft: "0px",
    paddingTop: "3px",
    paddingLeft: "14px",
    paddingRight: "14px",
  }
  // console.log(props.action_data,"action data!");
  const [formValue, setFormValue] = useState("");
  const [formSubmission, setFormSubmission] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [helperText, setHelperText] = useState(" ");

  const handleLinkClick = (path) => {
    window.open(path);
  }

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormValue(value);
  }

  const handleTwitterClick = () => {
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
        let email_submission = await submit_email(header_verification, formValue);
      } else {
        let sign_request = await props.sign_message();
        setFormSubmission(true);
        let email_submission = await submit_email(sign_request, formValue);
      }
    } else {
      setErrorState(true);
      setHelperText("Incorrect email format");
    }
  };

  const type_render = () => {
    if (props.action_data.type === "link") {
      return (
        <Grid sx={{height: "100%", width: "100%"}} container direction="column" justifyContent="space-around" alignItems="center">
          <Typography>{props.action_data.message}</Typography>
          <Button variant="contained" onClick={() => handleLinkClick(props.action_data.url)}
            sx={{color: "black",
            fontSize: "14px",
            fontWeight: "700",
            width: "40%",
            backgroundColor: "#F6F6F6"}}
          >PLACEHOLDER</Button>
        </Grid>
      )
    } else if (props.action_data.type === "form") {
      return (
        <Grid sx={{height: "100%", width: "100%"}} container justifyContent="center" alignItems="center">
          {formSubmission ?
            <Typography>Thanks!</Typography>
            :
            <Typography sx={{width: "80%"}}>{props.action_data.message}</Typography>
          }
          {formSubmission ?
            null
            :
            <form onSubmit={handleEmailSubmit} style={{height: "80%", width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column"}}>
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
                    color: "#F6F6F6"
                  }
                }}
              />
              <Button variant="contained" color="primary" type="submit"
                sx={{color: "black",
                fontSize: "14px",
                fontWeight: "700",
                width: "40%",
                backgroundColor: "#F6F6F6"}}>
                Submit
              </Button>
            </form>
          }
        </Grid>
      )
    } else if (props.action_data.type === "message") {
      <Typography>{props.action_data.message}</Typography>
    } else if (props.action_data.type === "twitterOauth") {
      //twitter oauth component
      return (
        <Grid sx={{height: "100%", width: "100%"}} container direction="column" justifyContent="space-around" alignItems="center">
          <Typography>{props.action_data.message}</Typography>
          <CONNECT_TWITTER
            variant="contained"
            style={{color: "black",
            fontSize: "14px",
            fontWeight: "700",
            width: "40%",
            backgroundColor: "#F6F6F6"}}
            handleButtonHover={() => props.handleOnDialogHover()}
            handleButtonClick={() => handleTwitterClick()}
          />
        </Grid>
      )
    }
  }

  return (
    <Box sx={{height: "100%"}}>
      {type_render()}
    </Box>
  );
}

// <Typography style={expanded_tab === "daily" ? styles.minus : styles.plus}>
// {expanded_tab === "daily" ? "-" : "+"}</Typography>
