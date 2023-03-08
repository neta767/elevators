export type elevator = {
    color: "red" | "green" | "black";
    floor: number;
    destinyFloor: number;
    available: boolean;
    index: number;
};

export type floor = {
    name: string;
    text: undefined | string;
    index: number;
    button: "call" | "waiting" | "arrived";
};