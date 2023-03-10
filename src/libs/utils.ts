import { ELEVATOR_VELOCITY, FLOOR_HEIGHT, WAITING_MS } from "../constants/settings";
import { elevator } from "./types";

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
    return elevatorsList.reduce((ele1: elevator, ele2: elevator) => {
        let time1 = calcArriveTime(ele1.currentFloor, callFloor, ele1.timeToBeAvailable)
        let time2 = calcArriveTime(ele2.currentFloor, callFloor, ele2.timeToBeAvailable)
        if (time1 < time2) {
            return ele1
        } else {
            return ele2
        }
    })
}

export function calcDistance(cur: number, dest: number): number {
    return (cur - dest) * FLOOR_HEIGHT
}

export function calcArriveTime(cur: number, dest: number, timeToBeAvailable: number | undefined = undefined): number {
    if (timeToBeAvailable) {
        return Math.abs(calcDistance(cur, dest)) * ELEVATOR_VELOCITY + timeToBeAvailable - d.getTime()
    }
    return Math.abs(calcDistance(cur, dest)) * ELEVATOR_VELOCITY

}

export function calcAvailableTime(cur: number, dest: number, timeToBeAvailable: number | undefined): number {
    return d.getTime() + calcArriveTime(cur, dest, timeToBeAvailable) + WAITING_MS
}