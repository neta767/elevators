export type elevator = {
    index: number;
    currentFloor: number;
    destinyFloor: number;
    elevatorState: "red" | "green" | "black";
    timeToBeAvailable: number | undefined;
};

export type floor = {
    index: number;
    ordinal: string; //Ground Floor, 1st, 2nd...
    buttonState: "call" | "waiting" | "arrived";
    elevatorTaskIndex: number | undefined;
    timeToPresent: string | undefined;
};

export type task = {
    floorCall: number,
    elevatorTaskIndex: number;
    elevatorTimeToBeAvailable: number | undefined;
}