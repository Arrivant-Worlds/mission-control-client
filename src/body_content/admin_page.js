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
import SimpleBar from "simplebar-react";
import ADMIN_QUIZ from "./admin_quiz_form.js";
import ADMIN_POLL from "./admin_poll_form.js";

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

export default function ADMIN_PAGE(props) {
  const [action, setAction] = React.useState('');
  const [data_poll, setDataPoll] = React.useState({
    type: "poll",
    xp_penalty:0,
    quiz: [
      {
        question: "",
        choices: "",
        image: ""
      }
    ]
  });
  const [data_quiz, setDataQuiz] = React.useState({
      type: "regular",
      xp_penalty:0,
      quiz: [
        {
          question: "",
          choices: "",
          correctAnswer: "",
          justification: ""
        }
      ]
    });
  const [payload, setPayload] = React.useState({
    title: "",
    xp: "",
    recurrence: "",
    platform: "",
    status: "",
    type: "",
    description: "",
    consumesDailyClaim: "",
  });


  const handleChangeAction = (event) => {
    setAction(event.target.value);
  };

  const handlePayloadChange = (e) => {
    let new_payload = {...payload};
    new_payload[e.target.name] = e.target.value;
    setPayload(new_payload);
  }

  const handleDataQuizChange = (e) => {
    let new_payload = {...data_quiz};
    new_payload.quiz[0][e.target.name] = e.target.value;
    setDataQuiz(new_payload);
  }

  const handleDataPollChange = (e) => {
    let new_payload = {...data_poll};
    new_payload.quiz[0][e.target.name] = e.target.value;
    setDataPoll(new_payload);
  }

  const handleSubmit = () => {

  }

  return (
    <Grid sx={{height: "100%", width: "90%"}} container alignItems="center" justifyContent="center">
      <Grid sx={{height: "80%", width: "80%"}} container direction="column" justifyContent="flex-start"
        alignItems="center">
        <SimpleBar style={{ height: '80%', width: "100%"}}>
          <Box sx={{ minWidth: 120, maxWidth: 200, margin: "20px auto 0 auto" }}>
            <FormControl fullWidth>
               <InputLabel id="action">Action</InputLabel>
               <Select
                 autoWidth
                 name="action"
                 labelId="action"
                 id="action-label"
                 label="Action"
                 value={action}
                 input={<BootstrapInput />}
                 onChange={handleChangeAction}
               >
                <MenuItem sx={paper_styles} value={"create"}>Create</MenuItem>
                <MenuItem sx={paper_styles} value={"update"}>Update</MenuItem>
                <MenuItem sx={paper_styles} value={"validate"}>Validate</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {action !== "" ? (
            <Box sx={{ minWidth: 120, maxWidth: 200, margin: "20px auto 0 auto" }}>
              <FormControl fullWidth>
                <InputLabel id="type">Type</InputLabel>
                <Select
                  autoWidth
                  name="type"
                  labelId="type"
                  id="type"
                  value={payload.type}
                  label="type"
                  input={<BootstrapInput />}
                  onChange={handlePayloadChange}
                >
                  <MenuItem sx={paper_styles} value={"quiz"}>Quiz</MenuItem>
                  <MenuItem sx={paper_styles} value={"poll"}>Poll</MenuItem>
                  <MenuItem sx={paper_styles} value={"event"}>Event</MenuItem>
                  <MenuItem sx={paper_styles} value={"retweet"}>Retweet</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )
          : null
          }
          {payload.type !== "" ? (
            <TextField
              variant="outlined"
              label="title"
              type="text"
              name="title"
              value={payload.title}
              onChange={handlePayloadChange}
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
          )
          : null
          }
          {payload.type !== "" ? (
            <TextField
              variant="outlined"
              label="xp"
              type="xp"
              name="xp"
              value={payload.xp}
              onChange={handlePayloadChange}
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
          )
          : null
          }
          {payload.type !== "" ? (
            <TextField
              variant="outlined"
              label="description"
              type="description"
              name="description"
              value={payload.description}
              onChange={handlePayloadChange}
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
          )
          : null
          }
          {payload.description !== "" ? (
            <Box sx={{ minWidth: 120, maxWidth: 200, margin: "20px auto 0 auto" }}>
              <FormControl fullWidth>
                <InputLabel id="recurrence">Recurrence</InputLabel>
                <Select
                  autoWidth
                  name="recurrence"
                  labelId="recurrence"
                  id="recurrence"
                  value={payload.recurrence}
                  label="recurrence"
                  input={<BootstrapInput />}
                  onChange={handlePayloadChange}
                >
                  <MenuItem sx={paper_styles} value={"prime"}>Prime</MenuItem>
                  <MenuItem sx={paper_styles} value={"daily"}>Daily</MenuItem>
                  <MenuItem sx={paper_styles} value={"weekly"}>Weekly</MenuItem>
                  <MenuItem sx={paper_styles} value={"permanent"}>Permanent</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )
          : null
          }
          {payload.recurrence !== "" ? (
            <Box sx={{ minWidth: 120, maxWidth: 200, margin: "20px auto 0 auto" }}>
              <FormControl fullWidth>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  autoWidth
                  name="status"
                  labelId="status"
                  id="status"
                  value={payload.status}
                  label="status"
                  input={<BootstrapInput />}
                  onChange={handlePayloadChange}
                >
                  <MenuItem sx={paper_styles} value={"active"}>Active</MenuItem>
                  <MenuItem sx={paper_styles} value={"disabled"}>Disabled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )
          : null
          }
          {payload.status !== "" ? (
            <Box sx={{ minWidth: 200, maxWidth: 200, margin: "20px auto 0 auto" }}>
              <FormControl fullWidth>
                <InputLabel id="consumesDailyClaim">Consumes Daily Claim</InputLabel>
                <Select
                  autoWidth
                  name="consumesDailyClaim"
                  labelId="consumesDailyClaim"
                  id="consumesDailyClaim"
                  value={payload.consumesDailyClaim}
                  label="consumeDailyClaim"
                  input={<BootstrapInput />}
                  onChange={handlePayloadChange}
                >
                  <MenuItem sx={paper_styles} value={true}>True</MenuItem>
                  <MenuItem sx={paper_styles} value={false}>False</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )
          : null
          }
          {payload.type === "quiz" && payload.consumesDailyClaim !== "" ? (
            <ADMIN_QUIZ
            handleDataQuizChange={handleDataQuizChange}
            payload={payload}
            data_quiz={data_quiz}
            />
          )
          : null
          }
          {payload.type === "poll" && payload.consumeDailyClaim !== "" ? (
            <ADMIN_POLL
            handleDataPollChange={handleDataPollChange}
            payload={payload}
            data_poll={data_poll}
            />
          )
          : null
          }
        </SimpleBar>
      </Grid>
    </Grid>
  );
}
