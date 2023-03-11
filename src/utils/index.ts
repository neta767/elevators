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

export function getBestElevator(elevatorsList: elevator[], callFloor: number): elevator {
    return elevatorsList.reduce((elevator1: elevator, elevator2: elevator) => {
        let time1 = calcDuration(elevator1.currentFloor, callFloor, elevator1.availableTime)
        let time2 = calcDuration(elevator2.currentFloor, callFloor, elevator2.availableTime)
        if (time1 < time2) {
            return elevator1
        } else {
            return elevator2
        }
    })
}

export function calcDistance(currentFloor: number, destinyFloor: number): number {
    return (currentFloor - destinyFloor) * FLOOR_HEIGHT
}

export function calcDuration(currentFloor: number, destinyFloor: number, timeToBeAvailable: number | null = null): number {
    if (timeToBeAvailable) {
        return Math.abs(calcDistance(currentFloor, destinyFloor)) * ELEVATOR_VELOCITY + timeToBeAvailable - d.getTime()
    }
    return Math.abs(calcDistance(currentFloor, destinyFloor)) * ELEVATOR_VELOCITY

}
//not pure!
export function calcAvailableTime(currentFloor: number, destinyFloor: number, timeToBeAvailable: number | null): number {
    return d.getTime() + calcDuration(currentFloor, destinyFloor, timeToBeAvailable) + WAITING_MS
}

export function calcDelay(timeToBeAvailable: number | null): number {
    if (timeToBeAvailable) {
        return timeToBeAvailable - d.getTime()
    }
    return 0
}