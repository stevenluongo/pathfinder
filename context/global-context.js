import React, { useContext, useState, useEffect } from "react";
import { generateBoard } from "../lib/board";

const GlobalContext = React.createContext();

export function useGlobalContext() {
    return useContext(GlobalContext);
}

const DEFAULT_COLORS = {start: '#956edd', finish: '#73f2b0', wall: "#003549"};
const DEFAULT_START_NODE = {col: 30, row: 12}
const DEFAULT_FINISH_NODE = {col: 10, row: 8}


function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

export function GlobalContextProvider({children}) {
    const [colors, setColors] = useState(DEFAULT_COLORS);
    const [loaded, setLoaded] = useState(false);
    const [speed, setSpeed] = useState(6);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mode, setMode] = useState({start: false, finish: false, wall: false});
    const [previousNode, setPreviousNode] = useState(null);
    const [startNode, setStartNode] = useState(DEFAULT_START_NODE);
    const [finishNode, setFinishNode] = useState(DEFAULT_FINISH_NODE)
    const [previousStartNode, setPreviousStartNode] = useState(null);
    const [previousFinishNode, setPreviousFinishNode] = useState(null);
    const [board, setBoard] = useState([]);
    const [isProcessingMode, setIsProcessingMode] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [dimensions, setDimensions] = useState({});
    const [success, setSuccess] = useState(false);


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
            const tempStartNode = {col : randomIntFromInterval(1, dimensions.cols - 1), row : randomIntFromInterval(1, dimensions.rows - 1)};
            const tempFinishNode = {col : randomIntFromInterval(1, dimensions.cols - 1), row : randomIntFromInterval(1, dimensions.rows - 1)};
            const board = generateBoard(dimensions.cols, dimensions.rows, tempStartNode, tempFinishNode);
            setStartNode(tempStartNode);
            setFinishNode(tempFinishNode)
            setBoard(board)
            setSuccess(false);
            setIsResetting(false);
        }, 1 * visitedNodes.length);
        }

    const fetchSpeed = async() => {
        const local_data = await JSON.parse(localStorage.getItem('speed'));
        if(local_data) {
            setSpeed(local_data);
            return;
        }
    }

    const fetchColors = async() => {
        const local_data = await JSON.parse(localStorage.getItem('appearance_colors'));
        if(local_data) {
            setColors(local_data)
            return;
        }
    }

    useEffect(() => {
        const loadApp = async () => {
            await fetchColors();
            await fetchSpeed();
            setLoaded(true)
        }
        loadApp();
    }, [])

    const value = {
        colors,
        setColors,
        DEFAULT_COLORS,
        loaded,
        setLoaded,
        speed,
        setSpeed,
        isAnimating,
        setIsAnimating,
        mode,
        setMode,
        previousNode,
        setPreviousNode,
        previousStartNode,
        setPreviousStartNode,
        startNode,
        setStartNode,
        finishNode,
        setFinishNode,
        board,
        setBoard,
        previousFinishNode,
        setPreviousFinishNode,
        isProcessingMode,
        setIsProcessingMode,
        isResetting,
        setIsResetting,
        dimensions,
        setDimensions,
        success,
        setSuccess,
        resetBoard
    }
    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}