import React, {useEffect, useState} from 'react';
import Node from './node';
import { dijkstra, getNodesInOrder } from '../algorithms/dijkstra';
import { visualizeDijkstra, visualizePath, generateBoard } from '../lib/board';
import { useGlobalContext } from '../context/global-context';

const DEFAULT_COLS = 50;
const DEFAULT_ROWS = 20;
const DEFAULT_START_NODE = {col: 30, row: 12}
const DEFAULT_FINISH_NODE = {col: 10, row: 8}
const BOARD_DEFAULTS = {
  DEFAULT_COLS, DEFAULT_ROWS, DEFAULT_START_NODE, DEFAULT_FINISH_NODE
}

const delta = 6;
let startX;
let startY;


function Board() {
  const [board, setBoard] = useState([]);
  const [startNode, setStartNode] = useState(DEFAULT_START_NODE)
  const [finishNode, setFinishNode] = useState(DEFAULT_FINISH_NODE)
  const [dimensions, setDimensions] = useState({});
  const [mouseDown, setMouseDown] = useState(false);
  const [isDragStart, setDragStart] = useState(false);
  const [isDragFinish, setDragFinish] = useState(false);
  const [previousNode, setPreviousNode] = useState({});
  const [boardWidth, setBoardWidth] = useState(0);

  const {speed} = useGlobalContext();

  useEffect(() => {
    const {rows, cols, availableWidth} = fetchDimensions();
    const board = generateBoard(cols, rows, startNode, finishNode);
    setBoardWidth(availableWidth);

    setDimensions({rows, cols});
    setBoard(board)

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [])

  const fetchDimensions = () => {
    const domEl = document.getElementById("board-wrap")
    const availableWidth = domEl.offsetWidth - 30;
    const availableHeight = domEl.offsetHeight - 30;
    const cols = Math.floor(availableWidth / 27);
    const rows = Math.floor(availableHeight / 27);
    console.log(availableWidth)
    return {cols, rows, availableWidth}
  }

  const handleMouseDown = () => {
    setMouseDown(true)
  }
  const handleMouseUp = () => {
    setMouseDown(false)
  }


  const handleDikjstra = async() => {
    const start = board[startNode.row][startNode.col];
    const finish = board[finishNode.row][finishNode.col];
    //fix dupe nodes
    board.forEach((row) => {
      row.forEach((node) => {
        if(node.isFinish) {
          if(node.row === finishNode.row && node.col === finishNode.col) return;
          node.isFinish = false
        }
        if(node.isStart) {
          if(node.row === startNode.row && node.col === startNode.col) return;
          node.isStart = false
        }
      })
    })
    const visitedSet = await dijkstra(start, finish, board);
    await visualizeDijkstra(visitedSet, speed)
    const nodesInOrder = getNodesInOrder(finish);
    setTimeout(async() => {
      await visualizePath(nodesInOrder)
      
    }, 250);
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
    if(isStart && !isDragFinish) {
      setDragStart(true)
      setPreviousNode(domEl)
      return;
    }

    if(isFinish && !isDragStart) {
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

  const onDragEnd =(evt, target) => {

    //check to see whether user dragged
    const diffX = Math.abs(evt.pageX - startX);
    const diffY = Math.abs(evt.pageY - startY);
  
    if (diffX < delta && diffY < delta) {
      //if user clicks
      return;
    } 

    const {row, col, isWall, isStart, isFinish} = target;
    const previousStartNode = board[startNode.row][startNode.col];
    const previousFinishNode = board[finishNode.row][finishNode.col];

    const startDomEl = document.getElementById(`node-${startNode.row}-${startNode.col}`);
    const finishDomEl = document.getElementById(`node-${finishNode.row}-${finishNode.col}`);

    //do nothing if target is a wall
    if(isWall) {
      if(isDragStart) {
        setTimeout(() => {
          startDomEl.classList.add("node-start")
        }, 500);
      }
      if(isDragFinish) {
        setTimeout(() => {
          finishDomEl.classList.add("node-finish")
        }, 500);
      }
      return;
    }

    //update new start node
    if(isDragStart) {
      //if user lands on the finish node
      if(isFinish) {
        setTimeout(() => {
          startDomEl.classList.add("node-start");
          previousNode.classList.remove('node-start')
        }, 500);
        setPreviousNode(null);
        setDragStart(false);
        return;
      }
      previousStartNode.isStart = false;
      target.isStart = true;
      setStartNode({col, row})
      setDragStart(false);
    }

    //update new finish node
    if(isDragFinish) {
      //if user lands on start node
      if(isStart) {
        setTimeout(() => {
          finishDomEl.classList.add('node-finish')
          previousNode.classList.remove('node-finish')
        }, 500);
        setPreviousNode(null)
        setDragFinish(false);
        return;
      }
      previousFinishNode.isFinish = false;
      target.isFinish = true;
      setFinishNode({col, row})
      setDragFinish(false);
    }
  }

  return (
    <div className='board_wrap' id="board-wrap">
      <table className='board'>
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
        <button className='visualize' onClick={handleDikjstra}>visualize</button>
    </div>
  )
}

export default Board;