import { useState } from "react";
import { elevator, floor, Props } from "../data/types";
import elevatorsStore from "../store/elevatorsStore";
import floorsStore from "../store/floorsStore";
import { getBestElevatorId } from "../utils";
import Buttons from "./Buttons";
import Elevators from "./Elevators";

function ElevatorsSystem({ floorsNumber, elevatorsNumber }: Props) {
  const [s, setS] = useState(0);
  const elevator: elevator = {
    currentFloor: 0,
    destinyFloor: 0,
    elevatorState: "black",
    availableTime: 0,
  };
  const floor: floor = {
    buttonState: "call",
    elevatorTaskId: -1,
    presentTime: "",
  };
  const [elevatorsStore, setElevatorsStore] = useState<Map<number, elevator>>(
    new Map(
      Array.from({ length: elevatorsNumber }).map((e, id) => [id, elevator])
    )
  );
  const [floorsStore, setFloorStore] = useState<Map<number, floor>>(
    new Map(Array.from({ length: floorsNumber }).map((e, id) => [id, floor]))
  );

  function elevatorCall(floorCallId: number): void {
    // floorCall =
    // //get best elevator by minimal time (consider the time it will be available)
    const bestElevator = getBestElevatorId(floorCallId);
    const state = floorsStore.getState();
    state.set(floorCallId, {
      elevatorTaskId: 2,
      presentTime: "2",
      buttonState: "waiting",
    });
    floorsStore.setState({
      ...state,
    });
    console.log("hi");
    // // update button to waiting state and add time
    // setFloorList((prev) => {
    //   return prev.map((floor: floor) =>
    //     floor.index === floorCall
    //       ? {
    //           ...floor,
    //           buttonState: "waiting",
    //           elevatorTaskIndex: bestElevator.index,
    //           timeToPresent: convertMsToMinSec(
    //             calcDuration(
    //               bestElevator.currentFloor,
    //               floorCall,
    //               bestElevator.availableTime
    //             )
    //           ),
    //         }
    //       : floor
    //   );
    // });
    // //update elevator time to be available
    // setElevatorsList((prev) => {
    //   return prev.map((elevator: elevator) =>
    //     elevator.index === bestElevator.index
    //       ? {
    //           ...elevator,
    //           availableTime: calcAvailableTime(
    //             bestElevator.currentFloor,
    //             floorCall,
    //             bestElevator.availableTime
    //           ),
    //         }
    //       : elevator
    //   );
    // });
    // console.log(bestElevator.availableTime);
    // const task: task = {
    //   floorCall: floorCall,
    //   elevatorTaskIndex: bestElevator.index,
    //   elevatorAvailableTime: bestElevator.availableTime,
    // };
    // //elevator available
    // if (bestElevator.elevatorState === "black") {
    //   handleElevatorTask(task);
    // } else {
    //   elevatorTaskQueue.current.push(task);
    // }
  }
  return (
    <div className="flex">
      {/* <button onClick={() => setS((prev) => prev + 1)}>try</button> */}
      <Elevators />
      <Buttons elevatorCall={elevatorCall} />
    </div>
  );
}

export default ElevatorsSystem;
