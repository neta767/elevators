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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStartBuilding(true);
          }}
        >
          <label>
            Number Of Elevators:
            <input
              type="number"
              value={elevatorsNumber}
              min={1}
              required
              onChange={(e) =>
                setElevatorsNumber((v) =>
                  e.target.validity.valid ? parseInt(e.target.value, 10) : v
                )
              }
            />
          </label>
          <label>
            Number Of Floors:
            <input
              type="number"
              value={floorsNumber}
              min={1}
              required
              onChange={(e) =>
                setFloorsNumber((v) =>
                  e.target.validity.valid ? parseInt(e.target.value, 10) : v
                )
              }
            />
          </label>
          <input type="submit" value="Submit"></input>
        </form>
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
