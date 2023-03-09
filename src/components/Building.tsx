import { useRef, useState } from "react";
import { elevator, floor } from "../libs/types";
import { calcTime, formatOrdinals, minT } from "../libs/utils";
import Elevator from "./Elevator";
import "./Building.css";
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
      timeToArrive: undefined,
      elevatorTaskIndex: undefined,
    }))
  );
  const [elevatorsList, setElevatorsList] = useState<elevator[]>(
    Array.from({ length: elevatorsNumber }).map((e, idx) => ({
      index: idx,
      currentFloor: 0,
      destinyFloor: 0,
      elevatorState: "black",
    }))
  );
  const elevatorCallQueue = useRef<number[]>([]);

  function callElevator(floorCall: number): void {
    //get best elevator be minimal time
    //TODO:fix
    const bestElevator = elevatorsList.reduce((acc, ele) =>
      minT(acc, ele, floorCall)
    );
    // update button to waiting state and add time
    setFloorList((cur: floor[]) => {
      return cur.map((floor: floor) =>
        floor.index === floorCall
          ? {
              ...floor,
              buttonState: "waiting",
              // timeToArrive:
              // elevatorTaskIndex:
            }
          : floor
      );
    });
    //elevator available
    if (bestElevator.elevatorState === "black") {
      handleElevatorTask(floorCall, bestElevator);
    } else {
      elevatorCallQueue.current.push(floorCall);
    }
  }

  function handleElevatorTask(floorCall: number, bestElevator: elevator) {
    // update the selected elevator for the task
    setElevatorsList((cur) => {
      return cur.map((elevator: elevator) =>
        elevator.index === bestElevator.index
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
          elevator.index === bestElevator.index
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
              }
            : floor
        );
      });

      const bell = new Audio(require("../assets/bell.mp3"));
      bell.play();
      // update button and elevator to available state after 2 seconds
      setTimeout(() => {
        setElevatorsList((cur) => {
          return cur.map((elevator: elevator) =>
            elevator.index === bestElevator.index
              ? {
                  ...elevator,
                  elevatorState: "black",
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
                  timeToArrive: undefined,
                  elevatorTaskIndex: undefined,
                }
              : floor
          );
        });
        // after finished the task check for other call and handle them
        if (elevatorCallQueue.current.length) {
          handleElevatorTask(elevatorCallQueue.current.shift()!, bestElevator);
        }
      }, 2000);
    }, calcTime(bestElevator.currentFloor, floorCall));
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
                {elevator.destinyFloor === floor.index &&
                  elevator.index === floor.elevatorTaskIndex &&
                  floor.timeToArrive}
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
