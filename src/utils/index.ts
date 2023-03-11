import { ELEVATOR_VELOCITY, FLOOR_HEIGHT, WAITING_MS } from "../data/settings";
import { elevator } from "../data/types";
import elevatorsStore, { ValuesElevatorsStore } from "../store/elevatorsStore";

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

export function getBestElevatorId(floorCallId: number): number {
    return Array.from(elevatorsStore.getState().keys()).reduce((elevatorId1: number, elevatorId2: number) => {
        let time1 = calcDuration(elevatorId1, floorCallId)
        let time2 = calcDuration(elevatorId2, floorCallId)
        if (time1 < time2) {
            return elevatorId1
        } else {
            return elevatorId2
        }
    })
}

export function calcDistance(currentFloor: number, destinyFloor: number): number {
    return (currentFloor - destinyFloor) * FLOOR_HEIGHT
}

export function calcDuration(elevatorId: number, destinyFloor: number): number {
    const t = elevatorsStore.getState().get(elevatorId)
    if (t?.currentFloor && t?.availableTime) {
        return Math.abs(calcDistance(t.currentFloor, destinyFloor)) * ELEVATOR_VELOCITY + t.availableTime - d.getTime()
    }
    if (t?.currentFloor) {
        return Math.abs(calcDistance(t.currentFloor, destinyFloor)) * ELEVATOR_VELOCITY
    }
    return 0
}
//not pure!
// export function calcAvailableTime(currentFloor: number, destinyFloor: number, timeToBeAvailable: number | null): number {
//     return d.getTime() + calcDuration(currentFloor, destinyFloor, timeToBeAvailable) + WAITING_MS
// }

export function calcDelay(timeToBeAvailable: number | null): number {
    if (timeToBeAvailable) {
        return timeToBeAvailable - d.getTime()
    }
    return 0
}