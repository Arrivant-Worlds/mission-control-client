import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from "@mui/material/Typography";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: "#000000",
    color: "#f6f6f6f6",
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

const paper_styles = {
  backgroundColor: "#000000",
}

export default function TWEET_ID_FORM(props) {

  return (
    <Grid sx={{width: "100%"}} container direction="column" justifyContent="flex-start" alignItems="center">
      <TextField
        variant="outlined"
        label="tweet_id"
        type="tweet_id"
        name="tweet_id"
        value={props.tweet_id}
        onChange={props.setTweet_id}
        sx={{
          caretColor: "#F6F6F6",
          background: "#000000",
          width: "90%",
          margin: "20px 0 15px 0",
          input: {
            color: "#F6F6F6",
          },
        }}
      />
    </Grid>
  );
}
