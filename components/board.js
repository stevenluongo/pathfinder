import React, {useEffect, useState} from 'react';
import Node from './node';
import styles from "../styles/board.module.scss"
import { dijkstra, getNodesInOrder } from '../algorithms/dijkstra';
import { visualizeDijkstra, visualizePath, generateBoard } from '../lib/board';

const DEFAULT_COLS = 50;
const DEFAULT_ROWS = 20;
const DEFAULT_START_NODE = {col: 10, row: 10}
const DEFAULT_FINISH_NODE = {col: 5, row: 8}
const BOARD_DEFAULTS = {
  DEFAULT_COLS, DEFAULT_ROWS, DEFAULT_START_NODE, DEFAULT_FINISH_NODE
}


function Board() {
  const [board, setBoard] = useState([]);
  const [startNode, setStartNode] = useState(DEFAULT_START_NODE)
  const [finishNode, setFinishNode] = useState(DEFAULT_FINISH_NODE)
  const [dimensions, setDimensions] = useState({});
  const [mouseDown, setMouseDown] = useState(false);
  const [isDragStart, setDragStart] = useState(false);
  const [isDragFinish, setDragFinish] = useState(false);
  const [previousNode, setPreviousNode] = useState({});

  useEffect(() => {
    const domEl = document.getElementById("board-wrap")
    const availableWidth = domEl.offsetWidth - 50;
    const availableHeight = domEl.offsetHeight - 50;
    const cols = Math.floor(availableWidth / 27);
    const rows = Math.floor(availableHeight / 27);
    const board = generateBoard(cols, rows, startNode, finishNode);
    setDimensions({rows: rows, cols: cols});
    setBoard(board)

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [])

  const handleMouseDown = () => {
    setMouseDown(true)
  }
  const handleMouseUp = () => {
    setMouseDown(false)
  }


  const handleDikjstra = async() => {
    const start = board[startNode.row][startNode.col];
    const finish = board[finishNode.row][finishNode.col];
    //fix dupe finish node
    board.forEach((row) => {
      row.forEach((node) => {
        if(node.isFinish) {
          if(node.row === finishNode.row && node.col === finishNode.col) return;
          node.isFinish = false
        }
      })
    })
    const visitedSet = await dijkstra(start, finish, board);
    await visualizeDijkstra(visitedSet)
    const nodesInOrder = getNodesInOrder(finish);
    await visualizePath(nodesInOrder)
  }

  const resetBoard = () => {
    const visitedNodes = Array.from(document.getElementsByClassName("node-visited"));
    visitedNodes.forEach((node, idx) => {
      setTimeout(() => {
          node.classList.contains("node-path") && node.classList.remove('node-path');
          node.classList.remove("node-visited")
      }, 3 * idx);
    });
    const board = generateBoard(BOARD_DEFAULTS);
    setBoard(board)
  }

  const updateNode = (target) => {
    const {isStart, isWall, isFinish, row, col} = target;
    const domEl = document.getElementById(`node-${row}-${col}`);
    if(isStart) {
      setDragStart(true)
      setPreviousNode(domEl)
      return;
    }

    if(isFinish) {
      setDragFinish(true);
      setPreviousNode(domEl);
      return;
    }

    
    if(isDragStart) {
      domEl.classList.add("node-start")
      setTimeout(() => {
        previousNode.classList.remove("node-start")
      }, 500);
      setPreviousNode(domEl);
      return;
    }

    if(isDragFinish) {
      domEl.classList.add("node-finish")
      setTimeout(() => {
        previousNode.classList.remove("node-finish")
      }, 500);
      setPreviousNode(domEl);
      return;
    }

    if(!isWall) {
      target.isWall = true;
      domEl.classList.add("node-wall");
    }
  }

  const onDragEnd =(target) => {
    const {row, col, isWall} = target;
    const previousStartNode = board[startNode.col][startNode.row];
    const previousFinishNode = board[finishNode.col][finishNode.row];
    if(isWall) {
      if(isDragStart) {
        setTimeout(() => {
          document.getElementById(`node-${startNode.row}-${startNode.col}`).classList.add("node-start")
        }, 500);
      }
      if(isDragFinish) {
        setTimeout(() => {
          document.getElementById(`node-${finishNode.row}-${finishNode.col}`).classList.add("node-finish")
        }, 500);
      }
      return;
    }
    if(isDragStart) {
      previousStartNode.isStart = false;
      target.isStart = true;
      setStartNode({col, row})
      setDragStart(false);
    }
    if(isDragFinish) {
      previousFinishNode.isFinish = false;
      target.isFinish = true;
      setFinishNode({col, row})
      setDragFinish(false);
    }
  }

  return (
    <div className={styles.wrap} id="board-wrap">
      <table className={styles.board}>
        <tbody>
        {board && board.map((row, idx) => {
          return <tr key={`row-${idx}`}>
            {row.map((node) => {
              return <Node onDragEnd={onDragEnd} mouseDown={mouseDown} updateNode={updateNode} key={`node-${node.row}-${node.col}`} node={node} />
            })}
            </tr>
        })}
        </tbody>
      </table>
      <button className={styles.visualize} onClick={handleDikjstra}>visualize</button>
    </div>
  )
}

export default Board;