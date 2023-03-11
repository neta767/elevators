import { useMemo, useRef, useState } from "react";
import { elevator, floor, task } from "../data/types";
import {
  calcDuration,
  calcAvailableTime,
  convertMsToMinSec,
  formatOrdinals,
  getBestElevator,
} from "../utils";
import { WAITING_MS } from "../data/settings";
import Elevator from "./Elevator";
import "./Building.css";

type Props = {
  floorsNumber: number;
  elevatorsNumber: number;
};
function Building({ floorsNumber, elevatorsNumber }: Props) {
  const floorsOrdinalNumerals = useMemo(
    () =>
      Array.from({ length: floorsNumber }).map((e, idx) =>
        formatOrdinals(floorsNumber - 1 - idx)
      ),
    [floorsNumber]
  ); //Ground Floor, 1st, 2nd...
  const [floorList, setFloorList] = useState<floor[]>(
    Array.from({ length: floorsNumber }).map((e, idx) => ({
      index: floorsNumber - 1 - idx,
      buttonState: "call",
      elevatorTaskIndex: null,
      presentTime: null,
    }))
  );
  const [elevatorsList, setElevatorsList] = useState<elevator[]>(
    Array.from({ length: elevatorsNumber }).map((e, idx) => ({
      index: idx,
      currentFloor: 0,
      destinyFloor: 0,
      elevatorState: "black",
      availableTime: null,
    }))
  );
  const elevatorTaskQueue = useRef<task[]>([]);
  const elevatorsListavailableTime = useRef<number[]>([]);

  function elevatorCall(floorCall: number): void {
    //get best elevator be minimal time
    const bestElevator = getBestElevator(elevatorsList, floorCall);
    // update button to waiting state and add time
    setFloorList((prev) => {
      return prev.map((floor: floor) =>
        floor.index === floorCall
          ? {
              ...floor,
              buttonState: "waiting",
              elevatorTaskIndex: bestElevator.index,
              timeToPresent: convertMsToMinSec(
                calcDuration(
                  bestElevator.currentFloor,
                  floorCall,
                  bestElevator.availableTime
                )
              ),
            }
          : floor
      );
    });
    //update elevator time to be available
    setElevatorsList((prev) => {
      return prev.map((elevator: elevator) =>
        elevator.index === bestElevator.index
          ? {
              ...elevator,
              availableTime: calcAvailableTime(
                bestElevator.currentFloor,
                floorCall,
                bestElevator.availableTime
              ),
            }
          : elevator
      );
    });
    console.log(bestElevator.availableTime);
    const task: task = {
      floorCall: floorCall,
      elevatorTaskIndex: bestElevator.index,
      elevatorAvailableTime: bestElevator.availableTime,
    };
    //elevator available
    if (bestElevator.elevatorState === "black") {
      handleElevatorTask(task);
    } else {
      elevatorTaskQueue.current.push(task);
    }
  }
  function handleElevatorTask({
    floorCall,
    elevatorTaskIndex,
    elevatorAvailableTime,
  }: task): void {
    const currentFloor = elevatorsList.filter(
      (elevator: elevator) => elevator.index === elevatorTaskIndex
    )[0].currentFloor;
    // update the selected elevator for the task
    setElevatorsList((prev) => {
      return prev.map((elevator: elevator) =>
        elevator.index === elevatorTaskIndex
          ? {
              ...elevator,
              elevatorState: "red",
              destinyFloor: floorCall,
            }
          : elevator
      );
    });
    // wait(()=>)??
    // clearTimeout
    // useEffect(() => {
    //   // Clear the interval when the component unmounts
    //   return () => clearTimeout(timerRef.current);
    // }, []);
    // update button and elevator when arrived
    setTimeout(() => {
      setElevatorsList((prev) => {
        return prev.map((elevator: elevator) =>
          elevator.index === elevatorTaskIndex
            ? {
                ...elevator,
                currentFloor: floorCall,
                elevatorState: "green",
              }
            : elevator
        );
      });
      setFloorList((prev) => {
        return prev.map((floor: floor) =>
          floor.index === floorCall
            ? {
                ...floor,
                buttonState: "arrived",
                timeToArrive: null,
                elevatorTaskIndex: null,
              }
            : floor
        );
      });
      //TODO:fix
      const bell = new Audio(require("../assets/bell.mp3"));
      bell.play();
      // update button and elevator to available state after 2 seconds
      setTimeout(() => {
        setElevatorsList((prev) => {
          return prev.map((elevator: elevator) =>
            elevator.index === elevatorTaskIndex
              ? {
                  ...elevator,
                  elevatorState: "black",
                  availableTime: null,
                }
              : elevator
          );
        });
        setFloorList((prev) => {
          return prev.map((floor: floor) =>
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
    }, calcDuration(currentFloor, floorCall, elevatorAvailableTime));
  }
  return (
    <div className="flex">
      <div>
        {floorsOrdinalNumerals.map((ordinal, index) => (
          <div key={index} className="cell ordinal">
            {ordinal}
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
                  floor.presentTime}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {floorList.map((floor: floor) => (
          <div key={floor.index} className="cell">
            <button
              onClick={() => elevatorCall(floor.index)}
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
