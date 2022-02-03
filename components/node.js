import React from 'react';
import { useGlobalContext } from '../context/global-context';

function Node({node, updateNode, mouseDown}) {
  const {row, col, isStart, isFinish, isWall} = node
  const id = `node-${row}-${col}`

  const {colors, mode, previousNode, setPreviousNode} = useGlobalContext();

  const handleClick = () => {
    updateNode(node)
  }


  const handleMouseOver = (e) => {
    e.preventDefault();
    if(mouseDown) updateNode(node);
    //update start mode hover color
    if(mode.start && !isWall && !isFinish && !isStart) {
      const domEl = document.getElementById(id);
      domEl.style.backgroundColor = colors.start;
      setTimeout(() => {
        if(previousNode) {
          previousNode.style.backgroundColor = '#181818';
        }
      }, 500);
      setPreviousNode(domEl);
    }
    //update finish mode hover color
    if(mode.finish && !isWall && !isFinish && !isStart) {
      const domEl = document.getElementById(id);
      domEl.style.backgroundColor = colors.finish;
      setTimeout(() => {
        if(previousNode) {
          previousNode.style.backgroundColor = '#181818';
        }
      }, 500);
      setPreviousNode(domEl);
    }
  }


  return (
    <td 
      onClick={handleClick} 
      id={id} 
      onMouseOver={handleMouseOver} 
      style={{backgroundColor: isStart ? colors.start : isFinish ? colors.finish : isWall  && colors.wall}}
    />
  )
}

export default Node;

