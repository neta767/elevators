import { formatOrdinals } from "../utils";
type Props = {
  floorsNumber: number;
};
function FloorsOrdinalNumerals({ floorsNumber }: Props) {
  return (
    <div className="col">
      {Array.from({ length: floorsNumber }).map((e, id) => (
        <div key={id} className="cell ordinal">
          {formatOrdinals(id)}
        </div>
      ))}
    </div>
  );
}

export default FloorsOrdinalNumerals;
