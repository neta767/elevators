import { ELEVATOR_VELOCITY, FLOOR_HEIGHT, WAITING_MS } from "../data/settings";
import { elevator } from "../data/types";

const pr = new Intl.PluralRules("en-US", { type: "ordinal" });
const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
]);
const d = new Date()
export function formatOrdinals(n: number): string {
    if (n === 0) {
        return "Ground Floor";
    }
    const rule = pr.select(n);
    const suffix = suffixes.get(rule);
    return `${n}${suffix}`;
};

export function convertMsToMinSec(milliseconds: number): string {
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor(((milliseconds % 360000) % 60000) / 1000);
    if (!minutes) {
        return `${seconds} sec.`;
    }
    return `${minutes} min. ${seconds} sec.`;
}

// return px Y distance to transform the elevator
export function calcDistanceTransform(currentFloor: number, destinyFloor: number): number {
    return (currentFloor - destinyFloor) * FLOOR_HEIGHT
}
// return ms duration for the elevator transition animation
export function calcDurationTransform(elevator: elevator, destinyFloor: number): number {
    return Math.abs(calcDistanceTransform(elevator.currentFloor, destinyFloor)) / ELEVATOR_VELOCITY
}

// return ms to delay the elevator transition animation
export function calcDelayTransition(availableTime: number): number {
    if (availableTime) {
        return availableTime - d.getTime()
    }
    return 0
}

// return the time in ms that elevator will get to destiny considering if it is not available now
export function calcDurationTask(elevator: elevator, destinyFloor: number, availableTime: number = elevator.availableTime): number {
    if (availableTime) {
        return calcDurationTransform(elevator, destinyFloor) + availableTime - d.getTime()
    }
    return calcDurationTransform(elevator, destinyFloor)
}
// return the time in ms that elevator will be available
export function calcAvailableTime(elevator: elevator, destinyFloor: number): number {
    return d.getTime() + calcDurationTask(elevator, destinyFloor) + WAITING_MS
}

export function getBestElevatorId(floorCallId: number, elevatorsArray: elevator[]): number {
    return Array.from(elevatorsArray.keys()).reduce((elevatorId1: number, elevatorId2: number) => {
        let time1 = calcDurationTask(elevatorsArray[elevatorId1], floorCallId)
        let time2 = calcDurationTask(elevatorsArray[elevatorId2], floorCallId)
        if (time1 < time2) {
            return elevatorId1
        } else {
            return elevatorId2
        }
    })
}