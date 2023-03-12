export type elevator = {
    currentFloor: number;
    destinyFloor: number;
    elevatorState: "red" | "green" | "black";
    availableTime: number;
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
    // elevatorAvailableTime: number;
}