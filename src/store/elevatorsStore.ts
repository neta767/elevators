import createStore from "./createStore";

const e = new Map(
    Array.from({ length: 5 }).map((e, id) => [
        id,
        {
            currentFloor: 0,
            destinyFloor: 0,
            elevatorState: "black",
            availableTime: 0,
        },
    ])
);
const elevatorsStore = createStore(e);

export type ValuesElevatorsStore = ReturnType<typeof elevatorsStore.getState>;

export default elevatorsStore;
