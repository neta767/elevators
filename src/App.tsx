import { useState } from "react";
import "./App.css";
import Building from "./components/Building";

function App() {
  //update after submitted setting for the building
  const [startBuilding, setStartBuilding] = useState(false);
  const [elevatorsNumber, setElevatorsNumber] = useState(5);
  const [floorsNumber, setFloorsNumber] = useState(10);
  return (
    <div className="App">
      <h1>Elevator Exercise</h1>
      {!startBuilding ? (
        <>
          <label>
            Number Of Elevators:
            <input
              type="number"
              name="elevatorsNumber"
              value={elevatorsNumber}
              min={1}
              required
              onChange={(e) => setElevatorsNumber(parseInt(e.target.value))}
            />
          </label>
          <label>
            Number Of Floors:
            <input
              type="number"
              name="floorsNumber"
              value={floorsNumber}
              min={1}
              required
              onChange={(e) => setFloorsNumber(parseInt(e.target.value))}
            />
          </label>
          <input
            type="submit"
            value="Submit"
            onClick={(e) => setStartBuilding(true)}
          ></input>
        </>
      ) : (
        <Building
          floorsNumber={floorsNumber}
          elevatorsNumber={elevatorsNumber}
        ></Building>
      )}
    </div>
  );
}

export default App;
