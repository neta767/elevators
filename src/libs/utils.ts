import { ELEVATOR_VELOCITY, FLOOR_HEIGHT } from "../constants/settings";
import { elevator } from "./types";

const pr = new Intl.PluralRules("en-US", { type: "ordinal" });
const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
]);
export function formatOrdinals(n: number) {
    if (n === 0) {
        return "Ground Floor";
    }
    const rule = pr.select(n);
    const suffix = suffixes.get(rule);
    return `${n}${suffix}`;
};

export function convertMillisecondsToMinutesSeconds(milliseconds: number) {
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor(((milliseconds % 360000) % 60000) / 1000);
    if (!minutes) {
        return `${seconds} sec.`;
    }
    return `${minutes} min. ${seconds} sec.`;
}

export function minT(acc: elevator, ele: elevator, callFloor: number) {
    if (
        Math.abs(acc.currentFloor - callFloor) <
        Math.abs(ele.currentFloor - callFloor)
    ) {
        return acc;
    } else {
        return ele;
    }
}

export function calcDistance(cur: number, dest: number) {
    return (cur - dest) * FLOOR_HEIGHT
}

export function calcTime(cur: number, dest: number) {
    return Math.abs(calcDistance(cur, dest)) * ELEVATOR_VELOCITY
}