export type elevator = {
    index: number;
    currentFloor: number;
    destinyFloor: number;
    elevatorState: "red" | "green" | "black";
    availableTime: number | null;
};

export type floor = {
    index: number;
    buttonState: "call" | "waiting" | "arrived";
    elevatorTaskIndex: number | null;
    presentTime: string | null;
};

export type task = {
    floorCall: number,
    elevatorTaskIndex: number;
    elevatorAvailableTime: number | null;
}