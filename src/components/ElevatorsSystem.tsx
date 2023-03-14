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

  function elevatorCall(floorCallId: number): void {
    //get best elevator by minimal time (consider the time it will be available)
    const bestElevatorId = getBestElevatorId(floorCallId, elevatorsArray);
    const bestElevator = elevatorsArray[bestElevatorId];
    // update button to waiting state and add time
    floorsUpdate(floorCallId, {
      buttonState: "waiting",
      elevatorTaskId: bestElevatorId,
      presentTime: convertMsToMinSec(
        calcDurationTask(bestElevator, floorCallId)
      ),
      elevatorAvailableTime: bestElevator.availableTime,
    });
    //update elevator time to be available after this call
    elevatorsUpdate(bestElevatorId, {
      availableTime: calcAvailableTime(bestElevator, floorCallId),
    });
    const task: task = {
      floorId: floorCallId,
      elevatorId: bestElevatorId,
    };
    //elevator available
    if (bestElevator.elevatorState === "black") {
      handleElevatorTask(task);
    } else {
      tasksQueue.current.push(task);
    }
  }

  function handleElevatorTask({ floorId, elevatorId }: task): void {
    const elevator = elevatorsArray[elevatorId];
    console.log(elevator);

    // update the selected elevator for the task
    elevatorsUpdate(elevatorId, {
      elevatorState: "red",
      destinyFloor: floorId,
    });
    // wait(()=>)??
    // clearTimeout
    // useEffect(() => {
    //   // Clear the interval when the component unmounts
    //   return () => clearTimeout(timerRef.current);
    // }, []);
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
      //TODO:fix
      const bell = new Audio(audio);
      bell.play();
      // update button and elevator to available state after WAITING_MS
      setTimeout(() => {
        elevatorsUpdate(elevatorId, {
          elevatorState: "black",
          availableTime: 0,
        });
        floorsUpdate(floorId, {
          buttonState: "call",
          elevatorAvailableTime: 0,
        });
        // after finished the task check for other call and handle them
        if (tasksQueue.current.length) {
          const task: task = tasksQueue.current.shift()!;
          handleElevatorTask(task);
        }
      }, WAITING_MS);
    }, calcDurationTask(elevator, floorId, floorsArray[floorId].elevatorAvailableTime));
  }
  return (
    <div className="flex">
      <Elevators floorsArray={floorsArray} elevatorsArray={elevatorsArray} />
      <Buttons elevatorCall={elevatorCall} floorsArray={floorsArray} />
    </div>
  );
}

export default ElevatorsSystem;
