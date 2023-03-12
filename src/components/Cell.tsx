import { elevator, floor } from "../data/types";
import Elevator from "./Elevator";

type Props = {
  floorId: number;
  elevatorId: number;
  floor: floor;
  elevator: elevator;
};
function Cell({ floorId, elevatorId, floor, elevator }: Props) {
  return (
    <div className="cell flat">
      {elevator.currentFloor === floorId && (
        <Elevator
          elevator={elevator}
          availableTime={floor.elevatorAvailableTime}
        />
      )}
      {elevatorId === floor.elevatorTaskId && floor.presentTime}
    </div>
  );
}

export default Cell;
