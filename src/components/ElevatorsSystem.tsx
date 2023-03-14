import { useRef } from "react";
import { WAITING_MS } from "../data/settings";
import { task } from "../data/types";
import useElevatorsArray from "../hooks/useElevatorsArray";
import useFloorsArray from "../hooks/useFloorsArray";
import {
  calcAvailableTime,
  calcDurationTask,
  convertMsToMinSec,
  getBestElevatorId,
} from "../utils";
import Buttons from "./Buttons";
import Elevators from "./Elevators";
import audio from "../assets/bell.mp3";

type Props = {
  floorsNumber: number;
  elevatorsNumber: number;
};

function ElevatorsSystem({ floorsNumber, elevatorsNumber }: Props) {
  const { elevatorsArray, elevatorsUpdate } =
    useElevatorsArray(elevatorsNumber);
  const { floorsArray, floorsUpdate } = useFloorsArray(floorsNumber);
  const tasksQueue = useRef<task[]>([]);
  // the time that each elevators will be available
  const elevatorsAvailableTimeArray = useRef<number[]>(
    Array(elevatorsNumber).fill(0)
  );

  /**
   * handle elevator call
   * @param floorCallId
   */
  function elevatorCall(floorCallId: number): void {
    //get best elevator by minimal time (consider the time it will be available)
    const bestElevatorId = getBestElevatorId(
      floorCallId,
      elevatorsArray,
      elevatorsAvailableTimeArray.current
    );
    const bestElevator = elevatorsArray[bestElevatorId];
    // update button to waiting state and add time
    floorsUpdate(floorCallId, {
      buttonState: "waiting",
      elevatorTaskId: bestElevatorId,
      presentTime: convertMsToMinSec(
        calcDurationTask(
          bestElevator.destinyFloor,
          floorCallId,
          elevatorsAvailableTimeArray.current[bestElevatorId]
        )
      ),
      elevatorAvailableTime:
        elevatorsAvailableTimeArray.current[bestElevatorId], // for calculate the time to delay the animation
    });
    //update elevator time to be available after this call
    elevatorsAvailableTimeArray.current[bestElevatorId] = calcAvailableTime(
      bestElevator.currentFloor,
      floorCallId,
      elevatorsAvailableTimeArray.current[bestElevatorId]
    );
    const task: task = {
      floorId: floorCallId,
      elevatorId: bestElevatorId,
    };
    if (bestElevator.elevatorState === "black") {
      //elevator available
      handleElevatorTask(bestElevator.currentFloor, task);
    } else {
      tasksQueue.current.push(task);
    }
  }

  /**
   * handel elevator task
   * @param currentFloor
   * @param task
   */
  function handleElevatorTask(
    currentFloor: number,
    { floorId, elevatorId }: task
  ): void {
    // update the selected elevator for the task
    elevatorsUpdate(elevatorId, {
      elevatorState: "red",
      destinyFloor: floorId,
    });
    // update button and elevator when arrived
    setTimeout(() => {
      elevatorsUpdate(elevatorId, {
        currentFloor: floorId,
        elevatorState: "green",
      });
      floorsUpdate(floorId, {
        buttonState: "arrived",
        presentTime: "",
        elevatorTaskId: -1,
      });
      const bell = new Audio(audio);
      bell.play();
      // update button and elevator to available state after WAITING_MS
      setTimeout(() => {
        elevatorsAvailableTimeArray.current[elevatorId] = 0;
        elevatorsUpdate(elevatorId, {
          elevatorState: "black",
        });
        floorsUpdate(floorId, {
          buttonState: "call",
          elevatorAvailableTime: 0,
        });
        // after finished the task check for other call and handle them
        if (tasksQueue.current.length) {
          const task = tasksQueue.current.shift();
          if (task && task.elevatorId === elevatorId) {
            handleElevatorTask(floorId, task);
          }
        }
      }, WAITING_MS);
    }, calcDurationTask(currentFloor, floorId, 0));
  }
  return (
    <div className="flex">
      <Elevators floorsArray={floorsArray} elevatorsArray={elevatorsArray} />
      <Buttons elevatorCall={elevatorCall} floorsArray={floorsArray} />
    </div>
  );
}

export default ElevatorsSystem;
