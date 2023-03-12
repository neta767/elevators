import { floor } from "../data/types";
import Button from "./Button";
type Props = {
  floorsArray: floor[];
  elevatorCall: (id: number) => void;
};
function Buttons({ floorsArray, elevatorCall }: Props) {
  return (
    <div className="col">
      {Array.from(
        floorsArray.map((floor, id) => (
          <div key={id} className="cell">
            <Button
              id={id}
              state={floor.buttonState}
              elevatorCall={elevatorCall}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default Buttons;
