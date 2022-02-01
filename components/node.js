import React, { useEffect } from 'react';
import { useGlobalContext } from '../context/global-context';

function Node({node, updateNode, mouseDown, onDragEnd}) {
  const {row, col, isStart, isFinish, isWall} = node
  const id = `node-${row}-${col}`

  const {colors} = useGlobalContext();

  const handleClick = () => {
    updateNode(node)
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
    updateNode(node)
  }

  const handleMouseOver = (e) => {
    e.preventDefault();
    if(mouseDown) updateNode(node)
  }

  const handleMouseUp = (evt) => {
    onDragEnd(evt, node);
  }

  return (
    <td 
      onClick={handleClick} 
      id={id} 
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver} 
      onMouseUp={handleMouseUp}
      style={{backgroundColor: isStart ? colors.start : isFinish ? colors.finish : isWall  && colors.wall}}
    />
  )
}

export default Node;

