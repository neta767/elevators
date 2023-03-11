import elevatorsStore from "../store/elevatorsStore";
import floorsStore from "../store/floorsStore";
import Cell from "./Cell";

function Elevators() {
  return (
    <div className="shadow flex">
      {Array.from(elevatorsStore.getState().keys()).map((elevatorId) => (
        <div className="col" key={elevatorId}>
          {Array.from(floorsStore.getState().keys()).map((floorId) => (
            <Cell
              floorId={floorId}
              elevatorId={elevatorId}
              key={floorId.toString() + elevatorId.toString()}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Elevators;
