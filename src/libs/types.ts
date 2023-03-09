export type elevator = {
    index: number;
    currentFloor: number;
    destinyFloor: number;
    elevatorState: "red" | "green" | "black";
};

export type floor = {
    index: number;
    ordinal: string; //Ground Floor, 1st, 2nd...
    buttonState: "call" | "waiting" | "arrived";
    timeToArrive: number | undefined;
    elevatorTaskIndex: Number | undefined;
};