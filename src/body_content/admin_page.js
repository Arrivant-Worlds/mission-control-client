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
import Button from "@mui/material/Button";
import ADMIN_QUIZ from "./admin_quiz_form.js";
import ADMIN_POLL from "./admin_poll_form.js";
import RETWEET_FORM from "./admin_retweet_form.js";
import {get_quests} from "../api_calls";

import {create_quest, update_quest, validate_quest} from "../api_calls";

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
  "&.Mui-selected,:hover": {
    backgroundColor: "#888888",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#888888",
  },
}

const validAdminQuests = ["quiz", "poll", "retweet", "event"];

export default function ADMIN_PAGE(props) {
  const [action, setAction] = React.useState('');
  const [missions, setMissions] = React.useState([{title: ""}]);
  const [selectedMission, setSelectedMission] = React.useState("");
  const [playerNames, setPlayerNames] = React.useState("");
  const [data_poll, setDataPoll] = React.useState({
    type: "poll",
    xp_penalty: 0,
    quiz: [
      {
        question: "",
        choices: "",
        image_url: ""
      }
    ]
  });
  const [data_quiz, setDataQuiz] = React.useState({
      type: "regular",
      xp_penalty: 0,
      quiz: [
        {
          question: "",
          choices: [],
          correctAnswer: "",
          justification: ""
        }
      ]
    });
  const [tweet_id, setTweet_id] = React.useState("");
  const [payload, setPayload] = React.useState({
    title: "",
    xp: 0,
    recurrence: "",
    platform: "",
    status: "",
    type: "",
    description: "",
    consumesDailyClaim: "",
  });


  const handleChangeAction = async (event) => {
    if (event.target.value === "update" || event.target.value === "validate") {
      let headers = await props.getWithExpiration();
      let retrievedMissions = await get_quests(headers);
      let onlyActiveMissions = retrievedMissions.filter((mission)=>{
        if(
          validAdminQuests.includes(mission.type)
        ){
          return mission
        }
      })

      setMissions(onlyActiveMissions);
    }
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

  const handleTweetDataChange = (e) => {
    setTweet_id(e.target.value);
  }

  const handleDataPollChange = (e) => {
    let new_payload = {...data_poll};
    new_payload.quiz[0][e.target.name] = e.target.value;
    setDataPoll(new_payload);
  }

  const handlePlayerNamesChange = (e) => {
    setPlayerNames(e.target.value);
  }

  const handleMissionSelect = (e) => {
    setSelectedMission(e.target.value);
      //set data
    let quest_index;
    for (let i=0;i<missions.length;i++) {
      if (missions[i].id === e.target.value) {
        quest_index = i;
        break;
      }
    }
    let mission_obj = missions[quest_index];
    let quest_obj = {
      title: mission_obj.title,
      xp: mission_obj.xp,
      recurrence: mission_obj.recurrence,
      platform: mission_obj.platform,
      status: mission_obj.status,
      type: mission_obj.type,
      description: mission_obj.description,
      consumesDailyClaim: mission_obj.consumesDailyclaim === true ? true : false,
    }
    if (mission_obj.type === "retweet") {
      console.log("TWEET GOT", mission_obj.data.tweet_id);
      setTweet_id(mission_obj.data.tweet_id);
    } else if (mission_obj.type === "quiz") {
      if (mission_obj.data.type === "regular") {
        setDataQuiz(mission_obj.data);
      } else {
        setDataPoll(mission_obj.data);
      }
    }
    setPayload(quest_obj);
  }

  const handleSubmit = async () => {
    console.log("data poll", data_poll)
    console.log("data quiz", data_quiz)
    let data_obj = {}
    if (payload.type === "poll" && action !== "validate") {
      payload.type = "quiz";
      payload.platform = "Discord";
      data_obj = data_poll;
    } else if (payload.type === "quiz" && action !== "validate") {
      payload.platform = "Discord";
      data_obj = data_quiz;
    } else if (payload.type === "retweet") {
      data_obj = {tweet_id: tweet_id};
      payload.platform = "twitter";
    } else if (payload.type === "event") {
      payload.platform = "Discord"
    }

    let quest_obj = {
      title: payload.title,
      type: payload.type,
      xp: payload.xp,
      recurrence: payload.recurrence,
      status: payload.status,
      platform: payload.platform,
      description: payload.description,
      consumesDailyClaim: payload.consumesDailyClaim,
      data: data_obj
    }
    let headers = await props.getWithExpiration();

    if (action === "create") {
      //add snackbar for completions?
      let create_quest_call = await create_quest(quest_obj, headers);
      if (create_quest_call.status === 200) {
        props.setAlertState({
          open: true,
          message: "quest created!",
          severity: "success",
        })
      } else {
        props.setAlertState({
          open: true,
          message: create_quest_call,
          severity: "error",
        })
      }
      handleReset();
    } else if (action === "update") {
      quest_obj.id = selectedMission;
      let update_quest_call = await update_quest(quest_obj, headers);
      if (update_quest_call.status === 200) {
        props.setAlertState({
          open: true,
          message: "quest updated!",
          severity: "success",
        })
      } else {
        props.setAlertState({
          open: true,
          message: update_quest_call,
          severity: "error",
        })
      }
      handleReset();
    } else if (action === "validate") {
      let names_array = playerNames.split(",");
      let validate_obj = {
        quest_id: selectedMission,
        discord_names: names_array
      }
      let validate_quest_call = await validate_quest(validate_obj, headers);
      if (validate_quest_call.status === 200) {
        props.setAlertState({
          open: true,
          message: "quest validated!",
          severity: "success",
        })
      } else {
        props.setAlertState({
          open: true,
          message: validate_quest_call,
          severity: "error",
        })
      }
      handleReset();
    }
  }

  const handleReset = () => {
    setAction("");
    setPlayerNames("");
    setSelectedMission("");
    setPayload({
      title: "",
      xp: 0,
      recurrence: "",
      platform: "",
      status: "",
      type: "",
      description: "",
      consumesDailyClaim: "",
    })
    setTweet_id("");
    setDataPoll({
      type: "poll",
      xp_penalty:0,
      quiz: [
        {
          question: "",
          choices: "",
          image: ""
        }
      ]
    })
    setDataQuiz({
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
    })
  }
  console.log("settweetid", setTweet_id);
  console.log("tweet_id", tweet_id);
  return (
    <Grid sx={{height: "100%", width: "90%"}} container alignItems="center" justifyContent="center">
      <Grid sx={{height: "80%", width: "80%"}} container direction="column" justifyContent="center"
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
          {action === "update" || action === "validate" ? (
            <Box sx={{ minWidth: 120, maxWidth: 200, margin: "20px auto 0 auto" }}>
              <FormControl fullWidth>
                <InputLabel id="mission">Mission</InputLabel>
                <Select
                  autoWidth
                  name="mission"
                  labelId="mission"
                  id="mission"
                  value={selectedMission}
                  label="Mission"
                  input={<BootstrapInput />}
                  onChange={handleMissionSelect}
                >
                  {
                    missions.map((item, i) => {
                      if (action === "validate") {
                        return (
                          <MenuItem sx={paper_styles} key={i} value={item.id}>{item.title}</MenuItem>
                        )
                      } else {
                        return (
                          <MenuItem sx={paper_styles} key={i} value={item.id}>{item.title}</MenuItem>
                        )
                      }
                    })
                  }
                </Select>
              </FormControl>
            </Box>
          )
          : null
          }
          {action !== "" && action === "create" ? (
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
          {action === "validate" && selectedMission !== "" ? (
            <TextField
              variant="outlined"
              label="Discord IDs"
              type="text"
              name="playerNames"
              placeholder="ex. 569485319561543680,800894271737561121,etc."
              value={playerNames}
              onChange={handlePlayerNamesChange}
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
          {payload.type !== "" && action !== "validate" ? (
            <TextField
              variant="outlined"
              label="Title"
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
          {payload.type !== "" && action !== "validate" ? (
            <TextField
              variant="outlined"
              label="XP"
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
          {payload.type !== "" && action !== "validate" ? (
            <TextField
              variant="outlined"
              label="Description"
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
          {payload.description !== "" && action !== "validate" ? (
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
          {payload.recurrence !== "" && action !== "validate" ? (
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
          {payload.status !== "" && action !== "validate" ? (
            <Box sx={{ minWidth: 200, maxWidth: 200, margin: "20px auto 0 auto" }}>
              <FormControl fullWidth>
                <InputLabel id="consumesDailyClaim">Consumes Daily Claim</InputLabel>
                <Select
                  autoWidth
                  name="consumesDailyClaim"
                  labelId="consumesDailyClaim"
                  id="consumesDailyClaim"
                  value={payload.consumesDailyClaim}
                  label="consumesDailyClaim"
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
          {payload.type === "quiz" && payload.consumesDailyClaim !== "" && action !== "validate"  ? (
            <ADMIN_QUIZ
            handleDataQuizChange={handleDataQuizChange}
            payload={payload}
            data_quiz={data_quiz}
            />
          )
          : null
          }
          {payload.type === "poll" && payload.consumesDailyClaim !== "" && action !== "validate" ? (
            <ADMIN_POLL
            handleDataPollChange={handleDataPollChange}
            payload={payload}
            data_poll={data_poll}
            />
          )
          : null
          }
          {payload.type === "retweet" && payload.consumesDailyClaim !== "" && action !== "validate" ? (
            <RETWEET_FORM
            payload={payload}
            tweet_id={tweet_id}
            handleTweetDataChange = {handleTweetDataChange}
            />
          )
          : null
          }
        </SimpleBar>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Button
          sx={{
            color: "black",
            fontSize: "14px",
            width: "20px",
            margin: "0 20px",
            height: "30px",
            fontWeight: "700",
            padding: "0 20px",
            backgroundColor: "#F6F6F6",
          }}
          onClick={() => handleSubmit()}>Submit</Button>
        <Button
          sx={{
            color: "black",
            fontSize: "14px",
            width: "20px",
            margin: "0 20px",
            height: "30px",
            fontWeight: "700",
            padding: "0 20px",
            backgroundColor: "#F6F6F6",
          }}
        onClick={() => handleReset()}>Reset</Button>
      </Grid>
    </Grid>
  );
}
