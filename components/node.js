import React from 'react';
import styles from "../styles/board.module.scss"

function Node({row, col, isStart, isFinish}) {
  return <td id={`node-${row}-${col}`} className={isStart ? styles.isStart : isFinish ? styles.isFinish : "" }/>
}

export default Node;