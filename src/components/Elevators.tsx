import { elevator, floor } from "../data/types";
import Cell from "./Cell";
type Props = {
  floorsArray: floor[];
  elevatorsArray: elevator[];
};
function Elevators({ floorsArray, elevatorsArray }: Props) {
  return (
    <div className="shadow flex">
      {elevatorsArray.map((elevator, elevatorId) => (
        <div className="col" key={elevatorId}>
          {floorsArray.map((floor, floorId) => (
            <Cell
              floorId={floorId}
              elevatorId={elevatorId}
              floor={floor}
              elevator={elevator}
              key={floorId.toString() + elevatorId.toString()}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Elevators;
