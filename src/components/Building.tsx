import FloorsOrdinalNumerals from "./FloorsOrdinalNumerals";
import "./Building.css";
import ElevatorsSystem from "./ElevatorsSystem";
type Props = {
  floorsNumber: number;
  elevatorsNumber: number;
};

function Building({ floorsNumber, elevatorsNumber }: Props) {
  return (
    <div className="flex">
      <FloorsOrdinalNumerals floorsNumber={floorsNumber} />
      <ElevatorsSystem
        floorsNumber={floorsNumber}
        elevatorsNumber={elevatorsNumber}
      />
    </div>
  );
}

export default Building;
