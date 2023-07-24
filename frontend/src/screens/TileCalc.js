import React, { useState } from "react";

export default function TileCalc() {
  const [len, setLen] = useState();
  const [wid, setWid] = useState();
  const [hei, setHei] = useState();
  const [out, setOut] = useState(null);

  function calculateWallAndFloorLengths(lengthFeet, widthFeet, heightFeet) {
    // Convert dimensions from feet to meters
    const lengthMeters = lengthFeet * 0.3148;
    const widthMeters = widthFeet * 0.3148;
    const heightMeters = heightFeet * 0.3148;

    var wall1Length = 0;
    var wall2Length = 0;
    var wall3Length = 0;
    var wall4Length = 0;

    if (heightFeet) {
      // Calculate the total length of each wall (excluding the floor and ceiling)
      wall1Length = Math.ceil(2 * (lengthMeters + heightMeters));
      wall2Length = Math.ceil(2 * (widthMeters + heightMeters));
      wall3Length = Math.ceil(2 * (lengthMeters + heightMeters));
      wall4Length = Math.ceil(2 * (widthMeters + heightMeters));
    }

    // Calculate the total area of the floor
    const floorArea = Math.ceil(lengthMeters * widthMeters);

    setOut({
      wall1Length,
      wall2Length,
      wall3Length,
      wall4Length,
      floorArea,
    });
  }

  return (
    <div className="container py-5">
      <h2 className="text-center">Tile Calculator</h2>
      <form
        className="w-50 mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          calculateWallAndFloorLengths(len, wid, hei);
        }}
      >
        <div className="form-group">
          <label>Room Width (ft)</label>
          <input
            type="number"
            min={0}
            className="form-control"
            onChange={(e) => {
              setWid(e.target.value);
            }}
          />
        </div>
        <br />
        <div className="form-group">
          <label>Room Length (ft)</label>
          <input
            type="number"
            min={0}
            required
            className="form-control"
            onChange={(e) => {
              setLen(e.target.value);
            }}
          />
        </div>
        <br />
        <div className="form-group">
          <label>Room Height (ft)</label>
          <input
            type="number"
            min={0}
            className="form-control"
            onChange={(e) => {
              setHei(e.target.value);
            }}
          />
        </div>
        <br />
        <input type="submit" value="Calculate" className="btn btn-primary" />
      </form>
      <br />
      {out && (
        <div className="w-50 text-center mx-auto">
          <div className="alert alert-primary">
            Wall 1 and Wall 3 need{" "}
            <span className="fw-bold color-dark">{out.wall1Length}</span> meter
            tiles
          </div>
          <div className="alert alert-primary">
            Wall 2 and Wall 4 need{" "}
            <span className="fw-bold color-dark">{out.wall2Length}</span> meter
            tiles
          </div>
          <div className="alert alert-primary">
            Floor needs {out.floorArea} meter tiles
          </div>
          <div className="alert alert-success">
            Total tiles needed:{" "}
            {out.floorArea + out.wall1Length + out.wall2Length} Meter
          </div>
        </div>
      )}
    </div>
  );
}
