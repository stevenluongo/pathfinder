import React, {useEffect, useState} from 'react';
import Node from './node';
import { dijkstra, getNodesInOrder } from '../algorithms/dijkstra';
import { visualizeDijkstra, visualizePath, generateBoard } from '../lib/board';
import { useGlobalContext } from '../context/global-context';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const DEFAULT_START_NODE = {col: 30, row: 12}
const DEFAULT_FINISH_NODE = {col: 10, row: 8}

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
  const [success, setSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const {speed, setIsAnimating, isAnimating, colors} = useGlobalContext();

  useEffect(() => {
    const {rows, cols} = fetchDimensions();
    const board = generateBoard(cols, rows, startNode, finishNode);

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
    return {cols, rows, availableWidth}
  }

  const handleMouseDown = () => {
    setMouseDown(true)
  }
  const handleMouseUp = () => {
    setMouseDown(false)
  }


  const handleDikjstra = async() => {
    setIsAnimating(true)
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
      setIsAnimating(false);  
      setSuccess(true)
    }, 250);

  }

  const resetBoard = () => {
    if(isResetting) {
      return;
    }
    setIsResetting(true);
    const visitedNodes = Array.from(document.getElementsByClassName("node-visited"));
    visitedNodes.forEach((node, idx) => {
      setTimeout(() => {
          node.classList.contains("node-path") && node.classList.remove('node-path');
          node.classList.remove("node-visited")
      }, 1 * idx);
    });
    setTimeout(() => {
      const board = generateBoard(dimensions.cols, dimensions.rows, startNode, finishNode);
      setBoard(board)
      setSuccess(false);
      setIsResetting(false);
    }, 1 * visitedNodes.length);
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
      domEl.style.backgroundColor = colors.start
      setTimeout(() => {
        previousNode.style.backgroundColor = '#181818';
      }, 500);
      setPreviousNode(domEl);
      return;
    }

    if(isDragFinish) {
      domEl.style.backgroundColor = colors.finish;
      setTimeout(() => {
        previousNode.style.backgroundColor = '#181818';
      }, 500);
      setPreviousNode(domEl);
      return;
    }

    if(!isWall) {
      target.isWall = true;
      domEl.style.backgroundColor = colors.wall
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
        <VisualizeButton
          className='visualize'
          onClick={success ? resetBoard : handleDikjstra}
          endIcon={success ? <RestartAltIcon/> : <AutoFixHighIcon />}
          loading={isAnimating || isResetting}
          loadingPosition="end"
          variant="contained"
      >
        {isAnimating ? 'animating ...' : success ? isResetting ? 'resetting ...' :'Reset' : 'Visualize'}
      </VisualizeButton>
    </div>
  )
}

export default Board;



const VisualizeButton = styled(LoadingButton)({
  color: '#cfc4ff',
  backgroundColor: '#3f22c0',
  '&:hover': {
    backgroundColor: '#341ba1',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:disabled': {
    boxShadow: 'none',
    backgroundColor: '#331e91',
    borderColor: '#005cbf',
    color: '#6048ca'
  },
})