import Elevator from "./Elevator";

type Props = {
  floorId: number;
  elevatorId: number;
};
function Cell({ floorId, elevatorId }: Props) {
  return (
    <div className="cell flat">
      {/* {elevator.currentFloor === floor.index && ( */}
      <Elevator></Elevator>
      {/* )} */}
      {/* {elevator.index === floor.elevatorTaskIndex && floor.presentTime} */}
    </div>
  );
}

export default Cell;
