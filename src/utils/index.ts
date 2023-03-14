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
/**
 * @param n number
 * @returns string format of ordinal n
 */
export function formatOrdinals(n: number): string {
    if (n === 0) {
        return "Ground Floor";
    }
    const rule = pr.select(n);
    const suffix = suffixes.get(rule);
    return `${n}${suffix}`;
};

/**
 * @param milliseconds 
 * @returns string form of minutes and seconds 
 */
export function convertMsToMinSec(milliseconds: number): string {
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor(((milliseconds % 360000) % 60000) / 1000);
    if (!minutes) {
        return `${seconds} sec.`;
    }
    return `${minutes} min. ${seconds} sec.`;
}

/**
 * @param currentFloor 
 * @param destinyFloor 
 * @returns px Y distance to transform the elevator
 */
export function calcDistanceTransform(currentFloor: number, destinyFloor: number): number {
    return (currentFloor - destinyFloor) * FLOOR_HEIGHT
}
/**
 * @param elevator 
 * @param destinyFloor 
 * @returns ms duration for the elevator transition animation
 */
export function calcDurationTransform(currentFloor: number, destinyFloor: number): number {
    return Math.abs(calcDistanceTransform(currentFloor, destinyFloor)) / ELEVATOR_VELOCITY
}
/**
 * @param availableTime 
 * @returns ms to delay the elevator transition animation
 */
export function calcDelayTransition(availableTime: number): number {
    if (availableTime) {
        return availableTime - d.getTime()
    }
    return 0
}
/**
 * @param elevator 
 * @param destinyFloor 
 * @param availableTime 
 * @returns the time in ms that elevator will get to destiny considering if it is not available now
 */
export function calcDurationTask(currentFloor: number, destinyFloor: number, availableTime: number): number {
    if (availableTime) {
        return calcDurationTransform(currentFloor, destinyFloor) + availableTime - d.getTime()
    }
    return calcDurationTransform(currentFloor, destinyFloor)
}
/**
 * @param currentFloor 
 * @param destinyFloor 
 * @param availableTime 
 * @returns the time in ms that elevator will be available
 */
export function calcAvailableTime(currentFloor: number, destinyFloor: number, availableTime: number): number {
    return d.getTime() + calcDurationTask(currentFloor, destinyFloor, availableTime) + WAITING_MS
}

/**
 * @param floorCallId 
 * @param elevatorsArray 
 * @param elevatorsAvailableTimeArray
 * @returns elevator id which will get to @param floorCallId in minimal time 
 */
export function getBestElevatorId(floorCallId: number, elevatorsArray: elevator[], elevatorsAvailableTimeArray: number[]): number {
    return Array.from(elevatorsArray.keys()).reduce((elevatorId1: number, elevatorId2: number) => {
        let time1 = calcDurationTask(elevatorsArray[elevatorId1].currentFloor, floorCallId, elevatorsAvailableTimeArray[elevatorId1])
        let time2 = calcDurationTask(elevatorsArray[elevatorId2].currentFloor, floorCallId, elevatorsAvailableTimeArray[elevatorId2])
        if (time1 < time2) {
            return elevatorId1
        } else {
            return elevatorId2
        }
    })
}