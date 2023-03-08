import { elevator, floor } from "../type";
import Elevator from "./Elevator";
type Props = {
  elevatorsList: elevator[];
  floorList: floor[];
};
function Elevators({ elevatorsList, floorList }: Props) {
  console.log(elevatorsList);

  return (
    <div className="col">
      {elevatorsList.map((elevator, elevatorIdx) => (
        <div className="row" key={elevatorIdx}>
          {floorList.map((floor) => (
            <div className="bg" key={floor.index}>
              <div
                className="cell-with-color"
                key={floor.index.toString() + elevatorIdx.toString()}
              >
                {elevator.floor}
                {floor.index}
                {elevator.floor === floor.index && (
                  <Elevator {...elevator}></Elevator>
                )}
                {floor.text}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Elevators;
