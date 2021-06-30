import { useState } from 'react';
import './App.css';
import List from './components/List';

function App() {

  const [gen, setGen] = useState(1)

  return (
    <div className="App">
      <div className="app-wrapper">
        <div className="title-card">
          <img src={"./img/gen-"+gen+".png"} style={{ height: 100 }} alt={"Pocket Pokedex - Fire Red"}/>
        </div>
        <List gen={gen} setGen={setGen}/>
      </div>
      <div className="footer">
        <h4>
          &#169; Krocified | 2021   
        </h4>
        <a href="https://github.com/Krocified/kros-pocket-pokedex" target="_blank" rel="noopener noreferrer">
          Source Code
        </a>
      </div>
    </div>
  );
}

export default App;
