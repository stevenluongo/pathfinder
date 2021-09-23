import React, {useEffect, useState} from 'react';
import Node from './node';
import styles from "../styles/board.module.scss"
import { dijkstra, getNodesInOrder } from '../algorithms/dijkstra';
import { visualizeDijkstra, visualizePath, generateBoard } from '../lib/board';

const DEFAULT_COLS = 50;
const DEFAULT_ROWS = 20;
const START_NODE = {col: 20, row: 10}
const FINISH_NODE = {col: 5, row: 8}
const BOARD_DEFAULTS = {
  DEFAULT_COLS, DEFAULT_ROWS, START_NODE, FINISH_NODE
}


function Board() {

  const [board, setBoard] = useState([]);

  useEffect(() => {
    const board = generateBoard(BOARD_DEFAULTS)
    setBoard(board)
  }, [])



  const handleDikjstra = async() => {
    const start = board[START_NODE.row][START_NODE.col];
    const finish = board[FINISH_NODE.row][FINISH_NODE.col];
    const visitedSet = await dijkstra(start, finish, board);
    console.log(visitedSet)
    await visualizeDijkstra(visitedSet)
    const nodesInOrder = getNodesInOrder(finish);
    await visualizePath(nodesInOrder)

  }

  return (
    <>
    <h1>Board</h1>
    <table className={styles.board}>
      <tbody>
      {board && board.map((row, idx) => {
        return <tr key={`row-${idx}`}>
          {row.map((node) => {
            return <Node key={`node-${node.row}-${node.col}`} {...node} />
          })}
          </tr>
      })}
      </tbody>
    </table>
    <button onClick={handleDikjstra}>Visualize</button>
    </>
  )
}

export default Board;