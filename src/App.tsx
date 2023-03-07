import "./App.css";
import Elevators from "./components/Elevators";
import logo from "./logo.svg";
function App() {
  return (
    <div className="App">
      {/* TODO: add config */}
      <p className="App-header">Elevator Exercise</p>
      <img src={logo} alt="logo" />

      <Elevators></Elevators>
    </div>
  );
}

export default App;
