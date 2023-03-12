type Props = {
  id: number;
  state: "call" | "waiting" | "arrived";
  elevatorCall: (id: number) => void;
};
function Button({ id, state, elevatorCall }: Props) {
  return (
    <button
      disabled={state !== "call"}
      onClick={() => elevatorCall(id)}
      className={`${state} shadow`}
    >
      {state}
    </button>
  );
}

export default Button;
