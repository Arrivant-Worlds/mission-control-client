import './App.css';
import background from './images/Panorama_11_8K_05C_1.png';
import black_circle from './images/black_circle.png';
import MAIN_PAGE from './body_content/main_page.js';

export default function App() {
  return (
    <div className="App" style={{
      backgroundImage: `url(${background})`,
      height: '100vh',
      width: '100vw',
    }}>
      <img style={{position: 'absolute', top: '40px', left: "40px"}} src={black_circle} alt="black_circle_logo"/>
      <MAIN_PAGE/>
    </div>
  );
}
