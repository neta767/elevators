import floorsStore, { ValuesFloorsStore } from "../store/floorsStore";
import Button from "./Button";
type Props = {
  floorsStore: ValuesFloorsStore;
  elevatorCall: (id: number) => void;
};
function Buttons({ floorsStore, elevatorCall }: Props) {
  return (
    <div className="col">
      {Array.from(floorsStore.keys()).map((id) => (
        <div key={id} className="cell">
          <Button
            id={id}
            state={floorsStore.get(id)?.buttonState}
            elevatorCall={elevatorCall}
          />
        </div>
      ))}
    </div>
  );
}

export default Buttons;
