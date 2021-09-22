import React from 'react';

function Node({row, col, isStart, isFinish}) {
  return <td className={isStart ? 'start-node' : isFinish ? "isFinish" : "" }/>
}

export default Node;