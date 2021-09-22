import React, {useEffect, useState} from 'react';
import Node from './node';
import styles from "./board.module.scss"

const DEFAULT_COLS = 20;
const DEFAULT_ROWS = 40;
const START_NODE = {col: 10, row: 10}
const FINISH_NODE = {col: 8, row: 8}


function Board() {

  const [board, setBoard] = useState([]);

  useEffect(() => {
    generateNodes()
  }, [])

  const generateNodes = () => {
    const tempBoard = []
    for(let col = 0; col < DEFAULT_COLS; col++) {
      let newRow = []
      for(let row = 0; row< DEFAULT_ROWS; row++) {
        const node = {
          row: row,
          col: col,
          isStart: row === START_NODE.row && col === START_NODE.col,
          isFinish: row === FINISH_NODE.row && col === FINISH_NODE.col,
        }
        newRow.push(node)
      }
      tempBoard.push(newRow);
    }
    setBoard(tempBoard);
    console.log(tempBoard)
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
    </>
  )
}

export default Board;