import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const numRows = 25;
const numCols = 25;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

let generation = 0;

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const [bgColor, setBgColor] = useState("Orange");

  const [speed, setSpeed] = useState(100);

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSim = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        generation += 1;
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSim, speedRef.current);
  }, []);

  return (
    <div className="main">
      <h1>Conway's Game of Life</h1>
      <h3>Number of Generation: {generation}</h3>
      <h3>Game speed: {speed}ms</h3>
      <div className="speedButtons">
        <button
          onClick={() => {
            setSpeed(speed - 20);
          }}
        >
          speed up
        </button>
        <button
          onClick={() => {
            setSpeed(speed + 20);
          }}
        >
          slow down
        </button>
      </div>
      <div className="wrapper">
        <div className="grid">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
            }}
          >
            {grid.map((rows, i) =>
              rows.map((col, k) => (
                <div
                  key={`${i}-${k}`}
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: grid[i][k] ? bgColor : undefined,
                    border: "solid 1px black",
                  }}
                />
              ))
            )}
          </div>
          <div className="buttons">
            <button
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSim();
                }
              }}
            >
              {running ? "stop" : "start"}
            </button>
            <button
              onClick={() => {
                setGrid(generateEmptyGrid());
                generation = 0;
              }}
            >
              clear
            </button>
            <button
              onClick={() => {
                const rows = [];
                for (let i = 0; i < numRows; i++) {
                  rows.push(
                    Array.from(Array(numCols), () =>
                      Math.random() > 0.7 ? 1 : 0
                    )
                  );
                }

                setGrid(rows);
              }}
            >
              random
            </button>
            <DropdownButton
              id="dropdown-basic-button"
              variant="secondary"
              title={bgColor === "Orange" ? "Choose a Color" : bgColor}
            >
              <Dropdown.Item
                href="#/action-1"
                onClick={() => {
                  setBgColor("Orange");
                }}
              >
                Default (Orange)
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-2"
                onClick={() => {
                  setBgColor("Purple");
                }}
              >
                Purple
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-3"
                onClick={() => {
                  setBgColor("Yellow");
                }}
              >
                Yellow
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-4"
                onClick={() => {
                  setBgColor("Pink");
                }}
              >
                Pink
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>

        <div className="rules">
          <h2>Rules:</h2>

          <li>
            Any live cell with fewer than two live neighbours dies, as if by
            underpopulation.
          </li>
          <li>
            Any live cell with two or three live neighbours lives on to the next
            generation.
          </li>
          <li>
            Any live cell with more than three live neighbours dies, as if by
            overpopulation.
          </li>
          <li>
            Any dead cell with exactly three live neighbours becomes a live
            cell, as if by reproduction.
          </li>
        </div>
      </div>

      <div className="algo">
        <h3>About this Algorithm:</h3>
        <p>
          In principle, the Game of Life field is infinite, but computers have
          finite memory. This leads to problems when the active area encroaches
          on the border of the array. Programmers have used several strategies
          to address these problems. The simplest strategy is to assume that
          every cell outside the array is dead. This is easy to program but
          leads to inaccurate results when the active area crosses the boundary.
          A more sophisticated trick is to consider the left and right edges of
          the field to be stitched together, and the top and bottom edges also,
          yielding a toroidal array. The result is that active areas that move
          across a field edge reappear at the opposite edge. Inaccuracy can
          still result if the pattern grows too large, but there are no
          pathological edge effects. Techniques of dynamic storage allocation
          may also be used, creating ever-larger arrays to hold growing
          patterns. The Game of Life on a finite field is sometimes explicitly
          studied; some implementations, such as Golly, support a choice of the
          standard infinite field, a field infinite only in one dimension, or a
          finite field, with a choice of topologies such as a cylinder, a torus,
          or a Möbius strip.
        </p>
      </div>
    </div>
  );
};

export default App;
