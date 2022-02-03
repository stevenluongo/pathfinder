import React, {useEffect, useState} from 'react';
import Node from './node';
import { dijkstra, getNodesInOrder } from '../algorithms/dijkstra';
import { visualizeDijkstra, visualizePath, generateBoard } from '../lib/board';
import { useGlobalContext } from '../context/global-context';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function Board() {
  const [dimensions, setDimensions] = useState({});
  const [mouseDown, setMouseDown] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const {setIsProcessingMode, board, setBoard, speed, setIsAnimating, isAnimating, colors, mode, setMode, previousNode, setPreviousNode, startNode, setStartNode, finishNode, setFinishNode} = useGlobalContext();

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
  }, []);

  useEffect(() => {
    if(mode.start || mode.finish || mode.wall) {
      handleMode();
    }
  }, [mode]);


  const handleMode = () => {
    //reset previous node
    setPreviousNode(null);

    //clear start node
    if(mode.start) {
      const domEl = document.getElementById(`node-${startNode.row}-${startNode.col}`);
      domEl.style.backgroundColor = '#181818';
    }
    //clear finish node
    if(mode.finish) {
      const domEl = document.getElementById(`node-${finishNode.row}-${finishNode.col}`);
      domEl.style.backgroundColor = '#181818';
    }
  }

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
    if(isAnimating) {
      return;
    }
    const {isStart, isWall, isFinish, row, col} = target;
    const domEl = document.getElementById(`node-${row}-${col}`);

    //if user clicks on start mode
    if(mode.start) {
      setIsProcessingMode(true);
      if(isFinish || isWall) {
        return;
      }
      //update start node
      setStartNode({col, row});
      domEl.style.backgroundColor = colors.start;
      setMode({...mode, start: false});

      //update start node in board state
      let updatedBoard = [];

      board.forEach((tempRow, index, array) => {
        let updatedRow = [];
        tempRow.forEach((node) => {
          if(node.isStart) {
            node.isStart = false
          }
          if(node.col === col && node.row === row) {
            node.isStart = true
          }
          updatedRow.push(node);
        });
        updatedBoard.push(updatedRow);
      });

      setBoard(updatedBoard)

      setTimeout(() => {
        setIsProcessingMode(false);
      }, 1500);
      return;
    }

    //if user clicks on finish mode
    if(mode.finish) {
      setIsProcessingMode(true);
      if(isStart || isWall) {
        return;
      }
      //update start node
      setFinishNode({col, row});
      domEl.style.backgroundColor = colors.finish;
      setMode({...mode, finish: false});

      //update start node in board state
      let updatedBoard = [];

      board.forEach((tempRow) => {
        let updatedRow = [];
        tempRow.forEach((node) => {
          if(node.isFinish) {
            node.isFinish = false
          }
          if(node.col === col && node.row === row) {
            node.isFinish = true
          }
          updatedRow.push(node);
        });
        updatedBoard.push(updatedRow);
      });

      setBoard(updatedBoard)

      setTimeout(() => {
        setIsProcessingMode(false);
      }, 1500);

      return;
    }

    if(isStart || isFinish) {
      return;
    }


    if(!isWall) {
      target.isWall = true;
      domEl.style.backgroundColor = colors.wall
    }
  }

  return (
    <div className='board_wrap' id="board-wrap">
      <table className='board'>
        <tbody>
        {board && board.map((row, idx) => {
          return <tr key={`row-${idx}`}>
            {row.map((node) => {
              return <Node mouseDown={mouseDown} updateNode={updateNode} key={`node-${node.row}-${node.col}`} node={node} />
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