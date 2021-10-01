export const visualizeDijkstra = (visitedSet) => new Promise(resolve => {
    visitedSet.forEach((node, idx) => {
        setTimeout(() => {
            //dont animate start / finish / wall nodes
            if(node.isStart || node.isFinish || node.isWall) {
                return;
            }
            //append node-visited class
            document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-visited")
        }, 10 * idx);
        })
    //resolve after animation
    setTimeout(() => {
        resolve()
    }, 10 * visitedSet.length);
});

export const visualizePath = (nodesInOrder) => new Promise(resolve => {
    nodesInOrder.forEach((node, idx) => {
        setTimeout(() => {
            document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-path")
        }, 70 * idx);
    })
    setTimeout(() => {
        resolve()
    }, 70 * nodesInOrder.length);
})

export const generateBoard = (DEFAULT_COLS, DEFAULT_ROWS, START_NODE, FINISH_NODE) => {
    const neighbors = fetchNeighborNodes(START_NODE, FINISH_NODE);

    const tempBoard = []
    for(let row = 0; row < DEFAULT_ROWS; row++) {
        const tempRow = []
        for(let col = 0; col< DEFAULT_COLS; col++) {
            const isStart = row === START_NODE.row && col === START_NODE.col;
            const isFinish = row === FINISH_NODE.row && col === FINISH_NODE.col;

            //20% chance bool
            let isWall = Math.random() < 0.2;

            //walls can't be directly next to start / finish nodes
            neighbors.forEach((node) => {
                if(node.col === col && node.row === row) {
                    isWall = false;
                }
            })

            if(isStart || isFinish) isWall = false;

            const node = {
                isWall: isWall,
                previousNode: null,
                distance: Infinity,
                row: row,
                col: col,
                isStart: isStart,
                isFinish: isFinish,
            }
            tempRow.push(node)
        }
        tempBoard.push(tempRow);
    }
    return tempBoard
}



const fetchNeighborNodes = (START_NODE, FINISH_NODE) => {
    const neighbors = [];
    const topStart = {...START_NODE , row: START_NODE.row + 1};
    const bottomStart = {...START_NODE , row: START_NODE.row - 1};
    const leftStart = {...START_NODE, col: START_NODE.col - 1};
    const rightStart = {...START_NODE, col: START_NODE.col + 1};

    const topFinish = {...FINISH_NODE , row: FINISH_NODE.row + 1};
    const bottomFinish = {...FINISH_NODE , row: FINISH_NODE.row - 1};
    const leftFinish = {...FINISH_NODE , col: FINISH_NODE.col - 1};
    const rightFinish = {...FINISH_NODE , col: FINISH_NODE.col + 1};

    neighbors.push(topStart, bottomStart, rightStart, leftStart, topFinish, bottomFinish, leftFinish, rightFinish)

    return neighbors;
}