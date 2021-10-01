import React, { useEffect } from 'react';

function Node({node, updateNode, mouseDown, onDragEnd}) {
  const {row, col, isStart, isFinish, isWall} = node
  const id = `node-${row}-${col}`

  useEffect(() => {
    const domEl = document.getElementById(id);
    if(isStart) domEl.classList.add("node-start");
    if(isFinish) domEl.classList.add("node-finish");
    if(isWall) domEl.classList.add('node-wall')
  }, [])

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
    />
  )
}

export default Node;

