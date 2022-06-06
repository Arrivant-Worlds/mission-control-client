import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import background from './images/Panorama_11_8K_05C_1.png';
import black_circle from './images/black_circle.png';
import MAIN_PAGE from './body_content/main_page.js';

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    fontWeight: "400",
    allVariants: {
      color: "#F6F6F6"
    }
  },
  palette: {
    // primary: {
    //   main: '#1A1A1A',
    //   dark: '#a10031',
    // },
  },
  overrides: {
    // MuiTypography: {
    //   root: {
    //   },
    //   body1: {
    //     // '&:hover': {
    //       //    color: '#15B999'
    //       // }
    //   },
    // }
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{
        backgroundImage: `url(${background})`,
        height: '100vh',
        width: '100vw',
      }}>
        <img style={{position: 'absolute', top: '40px', left: "40px"}} src={black_circle} alt="black_circle_logo"/>
        <MAIN_PAGE/>
      </div>
    </ThemeProvider>
  );
}
