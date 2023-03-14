export type elevator = {
    currentFloor: number;
    destinyFloor: number;
    elevatorState: "red" | "green" | "black";
};

export type floor = {
    buttonState: "call" | "waiting" | "arrived";
    elevatorTaskId: number;
    presentTime: string;
    elevatorAvailableTime: number;
};

export type task = {
    floorId: number,
    elevatorId: number;
}