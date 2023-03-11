import createStore from "./createStore";

const f = new Map(
    Array.from({ length: 10 }).map((e, id) => [
        id,
        {
            buttonState: "call",
            elevatorTaskId: -1,
            presentTime: '',
        },
    ])
);
const floorsStore = createStore(f);

export type ValuesFloorsStore = ReturnType<typeof floorsStore.getState>;

export default floorsStore;
