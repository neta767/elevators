import { useRef, useState } from "react";
import { elevator, floor, task } from "../libs/types";
import {
  calcArriveTime,
  calcAvailableTime,
  convertMsToMinSec,
  formatOrdinals,
  getBestElevator,
} from "../libs/utils";
import Elevator from "./Elevator";
import "./Building.css";
import { WAITING_MS } from "../constants/settings";

type Props = {
  floorsNumber: number;
  elevatorsNumber: number;
};

function Building({ floorsNumber, elevatorsNumber }: Props) {
  const [floorList, setFloorList] = useState<floor[]>(
    Array.from({ length: floorsNumber }).map((e, idx) => ({
      index: floorsNumber - 1 - idx,
      ordinal: formatOrdinals(floorsNumber - 1 - idx),
      buttonState: "call",
      elevatorTaskIndex: undefined,
      timeToPresent: undefined,
    }))
  );
  const [elevatorsList, setElevatorsList] = useState<elevator[]>(
    Array.from({ length: elevatorsNumber }).map((e, idx) => ({
      index: idx,
      currentFloor: 0,
      destinyFloor: 0,
      elevatorState: "black",
      timeToBeAvailable: undefined,
    }))
  );
  const elevatorTaskQueue = useRef<task[]>([]);

  function callElevator(floorCall: number): void {
    //get best elevator be minimal time
    const bestElevator = getBestElevator(elevatorsList, floorCall);
    // update button to waiting state and add time
    setFloorList((cur: floor[]) => {
      return cur.map((floor: floor) =>
        floor.index === floorCall
          ? {
              ...floor,
              buttonState: "waiting",
              elevatorTaskIndex: bestElevator.index,
              timeToPresent: convertMsToMinSec(
                calcArriveTime(
                  bestElevator.currentFloor,
                  floorCall,
                  bestElevator.timeToBeAvailable
                )
              ),
            }
          : floor
      );
    });
    //update elevator time to be available
    setElevatorsList((cur) => {
      return cur.map((elevator: elevator) =>
        elevator.index === bestElevator.index
          ? {
              ...elevator,
              timeToBeAvailable: calcAvailableTime(
                bestElevator.currentFloor,
                floorCall,
                bestElevator.timeToBeAvailable
              ),
            }
          : elevator
      );
    });
    //elevator available
    if (bestElevator.elevatorState === "black") {
      handleElevatorTask({
        floorCall: floorCall,
        elevatorTaskIndex: bestElevator.index,
        elevatorTimeToBeAvailable: bestElevator.timeToBeAvailable,
      });
    } else {
      elevatorTaskQueue.current.push({
        floorCall: floorCall,
        elevatorTaskIndex: bestElevator.index,
        elevatorTimeToBeAvailable: bestElevator.timeToBeAvailable,
      });
    }
  }
  function handleElevatorTask({
    floorCall,
    elevatorTaskIndex,
    elevatorTimeToBeAvailable,
  }: task): void {
    const currentFloor = elevatorsList.filter(
      (elevator: elevator) => elevator.index === elevatorTaskIndex
    )[0].currentFloor;
    // update the selected elevator for the task
    setElevatorsList((cur) => {
      return cur.map((elevator: elevator) =>
        elevator.index === elevatorTaskIndex
          ? {
              ...elevator,
              elevatorState: "red",
              destinyFloor: floorCall,
            }
          : elevator
      );
    });
    // update button and elevator when arrived
    setTimeout(() => {
      setElevatorsList((cur) => {
        return cur.map((elevator: elevator) =>
          elevator.index === elevatorTaskIndex
            ? {
                ...elevator,
                currentFloor: floorCall,
                elevatorState: "green",
              }
            : elevator
        );
      });
      setFloorList((cur) => {
        return cur.map((floor: floor) =>
          floor.index === floorCall
            ? {
                ...floor,
                buttonState: "arrived",
                timeToArrive: undefined,
                elevatorTaskIndex: undefined,
              }
            : floor
        );
      });
      //TODO:fix
      const bell = new Audio(require("../assets/bell.mp3"));
      bell.play();
      // update button and elevator to available state after 2 seconds
      setTimeout(() => {
        setElevatorsList((cur) => {
          return cur.map((elevator: elevator) =>
            elevator.index === elevatorTaskIndex
              ? {
                  ...elevator,
                  elevatorState: "black",
                  timeToBeAvailable: undefined,
                }
              : elevator
          );
        });
        setFloorList((cur) => {
          return cur.map((floor: floor) =>
            floor.index === floorCall
              ? {
                  ...floor,
                  buttonState: "call",
                }
              : floor
          );
        });
        // after finished the task check for other call and handle them
        if (elevatorTaskQueue.current.length) {
          const task: task = elevatorTaskQueue.current.shift()!;
          handleElevatorTask(task);
        }
      }, WAITING_MS);
    }, calcArriveTime(currentFloor, floorCall, elevatorTimeToBeAvailable));
  }
  return (
    <div className="flex">
      <div>
        {floorList.map((floor: floor) => (
          <div key={floor.index} className="cell ordinal">
            {floor.ordinal}
          </div>
        ))}
      </div>
      <div className="shadow flex">
        {elevatorsList.map((elevator: elevator) => (
          <div className="col" key={elevator.index}>
            {floorList.map((floor: floor) => (
              <div
                className="cell flat"
                key={floor.index.toString() + elevator.index.toString()}
              >
                {elevator.currentFloor === floor.index && (
                  <Elevator {...elevator}></Elevator>
                )}
                {elevator.index === floor.elevatorTaskIndex &&
                  floor.timeToPresent}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {floorList.map((floor: floor) => (
          <div key={floor.index} className="cell">
            <button
              onClick={() => callElevator(floor.index)}
              className={`${floor.buttonState} shadow`}
            >
              {floor.buttonState}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Building;
