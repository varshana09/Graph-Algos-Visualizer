import React, {useEffect, useState} from 'react';
import "./PathfindingVisualizer.css";
import Node from "../Node/Node.jsx"
import dfs from "../../algorithms/dfs.jsx"
import bfs from "../../algorithms/bfs.jsx"
import dijkstra from "../../algorithms/dijkstra.jsx"
export default function PathfindingVisualizer() {
  const [state,
    setState] = useState({
    grid: [],
    START_NODE_ROW: 10,
    FINISH_NODE_ROW: 10,
    START_NODE_COL: 10,
    FINISH_NODE_COL: 25,
    mouseIsPressed: false,
    ROW_COUNT: 20,
    COLUMN_COUNT: 50,
    isRunning: false,
    isStartNode: false,
    isFinishNode: false,
    isWallNode: false,
    currRow: 0,
    currCol: 0
  });

  function createNode(row, col) {
    //if(row==5&&col==5) console.log(state.START_NODE_COL);
    return {
      row,
      col,
      isStart: row === state.START_NODE_ROW && col === state.START_NODE_COL,
      isFinish: row === state.FINISH_NODE_ROW && col === state.FINISH_NODE_COL,
      distance: Infinity,
      distanceToFinishNode: Math.abs(state.FINISH_NODE_ROW - row) + Math.abs(state.START_NODE_COL - col),
      isVisited: false,
      isWall: false,
      previousNode: null,
      isNode: true
    }
  }

  function getInitialGrid() {
    let rc = state.ROW_COUNT;
    let cc = state.COLUMN_COUNT;
    let igrid = [];
    for (let r = 0; r < rc; r++) {
      let cr = [];
      for (let c = 0; c < cc; c++) {
        cr.push(createNode(r, c));
        // if(r===5&&c===5)
        // console.log(r===state.START_NODE_ROW&&c===state.START_NODE_COL);
        // if(cr[c].isStart) console.log("start");
      }
      igrid.push(cr);
    }
    return igrid;
  }
  useEffect(() => {
    setState(prevState => {
      return {
        ...prevState,
        grid: getInitialGrid()
      }
    })
  }, [])

  function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (!node.isStart && !node.isFinish && node.isNode) {
      const newNode = {
        ...node,
        isWall: !node.isWall
      };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  };
  function handleMouseDown(row, col) {
    console.log(state.isRunning);
    if (!state.isRunning) {
      if (isGridClear()) {
        let nodeClassName = document
          .getElementById(`node-${row}-${col}`)
          .className;
        if (nodeClassName === 'node node-start') {
          setState(prevState => {
            return {
              ...prevState,
              mouseIsPressed: true,
              isStartNode: true,
              currRow: row,
              currCol: col
            }
          });
        } else if (nodeClassName === 'node node-finish') {
          setState(prevState => {
            return {
              ...prevState,
              mouseIsPressed: true,
              isFinishNode: true,
              currRow: row,
              currCol: col
            }
          });
        } else {
          const newGrid = getNewGridWithWallToggled(state.grid, row, col);
          setState(prevState => {
            return {
              ...prevState,
              grid: newGrid,
              mouseIsPressed: true,
              isWallNode: true,
              currRow: row,
              currCol: col
            }
          });
        }
      }
    }
  }
  function handleMouseEnter(row, col) {
    if (!state.isRunning) {
      if (state.mouseIsPressed) {
        let nodeClassName = document
          .getElementById(`node-${row}-${col}`)
          .className;
        if (state.isStartNode) {
          if (nodeClassName !== 'node node-wall') {
            const prevStartNode = state.grid[state.currRow][state.currCol];
            prevStartNode.isStart = false;
            document
              .getElementById(`node-${state.currRow}-${state.currCol}`,)
              .className = 'node';
            setState(prevState => {
              return {
                ...prevState,
                currRow: row,
                currCol: col
              }
            });
            const currStartNode = state.grid[row][col];
            currStartNode.isStart = true;
            document
              .getElementById(`node-${row}-${col}`)
              .className = 'node node-start';
          }
          setState(prevState => {
            return {
              ...prevState,
              START_NODE_ROW: row,
              START_NODE_COL: col
            }
          });
        } else if (state.isFinishNode) {
          if (nodeClassName !== 'node node-wall') {
            const prevFinishNode = state.grid[state.currRow][state.currCol];
            prevFinishNode.isFinish = false;
            document
              .getElementById(`node-${state.currRow}-${state.currCol}`,)
              .className = 'node';
            setState(prevState => {
              return {
                ...prevState,
                currRow: row,
                currCol: col
              }
            });
            const currFinishNode = state.grid[row][col];
            currFinishNode.isFinish = true;
            document
              .getElementById(`node-${row}-${col}`)
              .className = 'node node-finish';
          }
          setState(prevState => {
            return {
              ...prevState,
              Finish_NODE_ROW: row,
              Finish_NODE_COL: col
            }
          });
        } else if (state.isWallNode) {
          const newGrid = getNewGridWithWallToggled(state.grid, row, col);
          setState(prevState => {
            return {
              ...prevState,
              grid: newGrid
            }
          });
        }
      }
    }
  }
  function handleMouseLeave() {
    if (state.isStartNode) {
      const isStartNode = !state.isStartNode;
      setState(prevState => {
        return {
          ...prevState,
          isStartNode,
          mouseIsPressed: false
        }
      });
    } else if (state.isFinishNode) {
      const isFinishNode = !state.isFinishNode;
      setState(prevState => {
        return {
          ...prevState,
          isFinishNode,
          mouseIsPressed: false
        }
      });
    } else if (state.isWallNode) {
      const isWallNode = !state.isWallNode;
      setState(prevState => {
        return {
          ...prevState,
          isWallNode,
          mouseIsPressed: false
        }
      });
      //getInitialGrid();
    }
  }
  function handleMouseUp(row, col) {
    if (!state.isRunning) {
      setState(prevState => {
        return {
          ...prevState,
          mouseIsPressed: false
        }
      })
      if (state.isStartNode) {
        const isStartNode = !state.isStartNode;
        setState(prevState => {
          return {
            ...prevState,
            isStartNode,
            START_NODE_ROW: row,
            START_NODE_COL: col
          }
        });
      } else if (state.isFinishNode) {
        const isFinishNode = !state.isFinishNode;
        setState(prevState => {
          return {
            ...prevState,
            isFinishNode,
            FINISH_NODE_ROW: row,
            FINISH_NODE_COL: col
          }
        });
      }
    }
  }

  function isGridClear() {
    for (const row of state.grid) {
      for (const node of row) {
        const nodeClassName = document
          .getElementById(`node-${node.row}-${node.col}`,)
          .className;
        if (nodeClassName === 'node node-visited' || nodeClassName === 'node node-shortest-path') {
          return false;
        }
      }
    }
    return true;
  }

  function toggleIsRunning() {
    setState(prevState => {
      return {
        ...prevState,
        isRunning: !state.isRunning
      }
    })
  }

  function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  function visualize(algo) {
    toggleIsRunning();
    let {grid} = state;
    let startNode = grid[state.START_NODE_ROW][state.START_NODE_COL];
    let finishNode = grid[state.FINISH_NODE_ROW][state.FINISH_NODE_COL];
    let visitedNodesInOrder;
    switch (algo) {
      case "DFS":
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      case "BFS":
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case "Dijkstra":
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      default:
        break;
    }
    let nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    nodesInShortestPathOrder.push("end");
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document
          .getElementById(`node-${node.row}-${node.col}`)
          .className;
        if (nodeClassName !== 'node node-start' && nodeClassName !== 'node node-finish') {
          document
            .getElementById(`node-${node.row}-${node.col}`)
            .className = 'node node-visited';
        }
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (nodesInShortestPathOrder[i] === 'end') {
        setTimeout(() => {
          toggleIsRunning();
        }, i * 50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document
            .getElementById(`node-${node.row}-${node.col}`,)
            .className;
          if (nodeClassName !== 'node node-start' && nodeClassName !== 'node node-finish') {
            document
              .getElementById(`node-${node.row}-${node.col}`)
              .className = 'node node-shortest-path';
          }
        }, i * 40);
      }
    }
  }

  var {grid, mouseIsPressed} = state;
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar bg-dark">
        <a className="navbar-brand" href="/">
          <b>PathFinding Visualizer</b>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <button
            type="button"
            className="btn btn-primary moveLeft"
            onClick={() => visualize('Dijkstra')}>
            Dijkstra's
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => visualize('BFS')}>
            Bread First Search
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => visualize('DFS')}>
            Depth First Search
          </button>
        </div>
      </nav>
      <table className="grid-container" onMouseLeave={() => handleMouseLeave()}>
        <tbody className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                      onMouseUp={() => handleMouseUp(row, col)}
                      row={row}></Node>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
