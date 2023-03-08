import { useState } from "react";

function ElevatorButton() {
  const [state, setState] = useState("call");
  function calledElevator(): void {
    setState("waiting");
  }
  return (
    <button onClick={calledElevator} className={state}>
      {state}
    </button>
  );
}

export default ElevatorButton;
