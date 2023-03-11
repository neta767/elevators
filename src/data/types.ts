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
};

export type task = {
    floorCall: number,
    elevatorTaskIndex: number;
    elevatorAvailableTime: number | null;
}

export type Props = {
    floorsNumber: number;
    elevatorsNumber: number;
};