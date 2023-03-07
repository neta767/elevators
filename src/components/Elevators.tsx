function Elevators() {
  const arrFloors = Array.from({ length: 10 })
    .map((e, idx) => idx)
    .reverse();
  const arrElevators = Array.from({ length: 5 }).map((e, idx) => idx);

  return (
    <div className="grid-container">
      {arrElevators.map((elevator) => (
        <div className="row" key={elevator}>
          {arrFloors.map((floor) => (
            <div className="grid-item" key={floor}>
              {floor}
              {elevator}
              <img src="../assets/elevator.png" alt="p" />
            </div>
          ))}
        </div>
      ))}
      {/* <div className="grid-item">2</div>
      <div className="grid-item">3</div>
      <div className="grid-item">4</div>
      <div className="grid-item">5</div>
      <div className="grid-item">6</div>
      <div className="grid-item">7</div>
      <div className="grid-item">8</div>
      <div className="grid-item">9</div> */}
    </div>
  );
}

export default Elevators;
