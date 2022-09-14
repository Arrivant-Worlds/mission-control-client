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

export default function ADMIN_POLL(props) {

  return (
    <Grid sx={{width: "100%"}} container direction="column" justifyContent="flex-start" alignItems="center">
      <TextField
        variant="outlined"
        label="Question"
        type="question"
        name="question"
        value={props.data_poll.quiz[0].question}
        onChange={props.handleDataPollChange}
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
      <TextField
        variant="outlined"
        label="Choices"
        type="choices"
        name="choices"
        placeholder="ex. cat, dog, bird, platypus, etc."
        value={props.data_poll.quiz[0].choices}
        onChange={props.handleDataPollChange}
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
      <TextField
        variant="outlined"
        label="Image Url"
        type="image_url"
        name="image_url"
        placeholder="image url"
        value={props.data_poll.quiz[0].image_url}
        onChange={props.handleDataPollChange}
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
