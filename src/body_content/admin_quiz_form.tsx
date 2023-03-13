import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputBase from '@mui/material/InputBase';
import { AdminPayload, AdminQuiz } from "interfaces";
import { PayloadChangeEvent } from "./admin_page";


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

interface AdminQuizProps {
  handleDataQuizChange: (e: PayloadChangeEvent<{question: string, choices: string[], justification: string, correctAnswer: string}>) => void
  payload: AdminPayload
  data_quiz: AdminQuiz
}


export default function ADMIN_QUIZ(props: AdminQuizProps) {


  return (
    <Grid sx={{width: "100%"}} container direction="column" justifyContent="flex-start" alignItems="center">
      <TextField
        variant="outlined"
        label="Question"
        type="question"
        name="question"
        value={props.data_quiz.quiz[0].question}
        onChange={props.handleDataQuizChange}
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
        placeholder="ex. cat,dog,bird,platypus,etc."
        value={props.data_quiz.quiz[0].choices}
        onChange={props.handleDataQuizChange}
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
        label="Correct Answer"
        type="correctAnswer"
        name="correctAnswer"
        value={props.data_quiz.quiz[0].correctAnswer}
        onChange={props.handleDataQuizChange}
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
        label="Justification"
        type="justification"
        name="justification"
        value={props.data_quiz.quiz[0].justification}
        onChange={props.handleDataQuizChange}
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
