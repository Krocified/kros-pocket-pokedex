import './App.css';
import List from './components/List';

function App() {
  return (
    <div className="App">
      <div className="title-card">
        <img src={"./img/firered.png"} style={{ height: 100 }} alt={"Pocket Pokedex - Fire Red"}/>
      </div>
      <List/>
    </div>
  );
}

export default App;
