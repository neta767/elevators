import { useState } from "react";
import Elevator from "./Elevator";
export type elevator = {
  color: "red" | "green" | "black";
  floor: number;
  destinyFloor: number;
  available: boolean;
  index: number;
};

export type floor = {
  name: string;
  text: undefined | string;
  index: number;
  button: "call" | "waiting" | "arrived";
};

const pr = new Intl.PluralRules("en-US", { type: "ordinal" });
const suffixes = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

const formatOrdinals = (n: number) => {
  if (n === 0) {
    return "Ground Floor";
  }
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
};

function Building() {
  const [floorList, setFloorList] = useState(
    Array.from({ length: 10 })
      .map((e, idx) => ({
        index: idx,
        name: formatOrdinals(idx),
        text: undefined,
        button: "call",
      }))
      .reverse()
  );

  const [elevatorsList, setElevatorsList] = useState<elevator[]>(
    Array.from({ length: 5 }).map((e, idx) => ({
      index: idx,
      available: true,
      color: "black",
      floor: 0,
      destinyFloor: 0,
    }))
  );
  let elevatorCallQueue = [];

  function callElevator(floorIdx: number): void {
    const newFloorList = floorList.map((floor) =>
      floor.index === floorIdx ? { ...floor, button: "waiting" } : floor
    );
    setFloorList(newFloorList);
    const smallestDistanceElevator = elevatorsList
      .filter((elevator) => elevator.available)
      .reduce(function (acc, fl) {
        if (Math.abs(acc.floor - floorIdx) < Math.abs(fl.floor - floorIdx)) {
          return acc;
        } else {
          return fl;
        }
      }, elevatorsList[0]);
    if (smallestDistanceElevator.available) {
      const newElevatorList: elevator[] = elevatorsList.map((elevator) =>
        elevator.index === smallestDistanceElevator.index
          ? {
              ...elevator,
              available: false,
              color: "red",
              destinyFloor: floorIdx,
            }
          : elevator
      );
      setElevatorsList(newElevatorList);
      setTimeout(() => {
        console.log("hi");
        const newElevatorList: elevator[] = elevatorsList.map((elevator) =>
          elevator.index === smallestDistanceElevator.index
            ? {
                ...elevator,
                color: "green",
              }
            : elevator
        );
        setElevatorsList(newElevatorList);
        // }, Math.abs((smallestDistanceElevator.floor - floorIdx) * 41.33) * 5);
      }, 2000);
    } else {
      elevatorCallQueue.push(floorIdx);
    }
  }

  return (
    <div className="elevators">
      <div className="row">
        {floorList.map((floor) => (
          <div key={floor.index} className="cell">
            {floor.name}
          </div>
        ))}
      </div>
      <div className="col">
        {elevatorsList.map((elevator, elevatorIdx) => (
          <div className="row" key={elevatorIdx}>
            {floorList.map((floor) => (
              <div className="bg" key={floor.index}>
                <div
                  className="cell-with-color"
                  key={floor.index.toString() + elevatorIdx.toString()}
                >
                  {elevator.floor === floor.index && (
                    <Elevator {...elevator}></Elevator>
                  )}
                  {floor.text}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="row">
        {floorList.map((floor) => (
          <div key={floor.index} className="cell">
            <button
              onClick={() => callElevator(floor.index)}
              className={floor.button}
            >
              {floor.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Building;
