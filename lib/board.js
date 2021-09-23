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
        }, 50 * idx);
    })
    setTimeout(() => {
        resolve()
    }, 50 * nodesInOrder.length);
})

export const generateBoard = (DEFAULT_COLS, DEFAULT_ROWS, START_NODE, FINISH_NODE) => {
    const tempBoard = []
    for(let row = 0; row < DEFAULT_ROWS; row++) {
        const tempRow = []
        for(let col = 0; col< DEFAULT_COLS; col++) {
            const node = {
                isWall: false,
                previousNode: null,
                distance: Infinity,
                row: row,
                col: col,
                isStart: row === START_NODE.row && col === START_NODE.col,
                isFinish: row === FINISH_NODE.row && col === FINISH_NODE.col,
            }
            tempRow.push(node)
        }
        tempBoard.push(tempRow);
    }
    return tempBoard
}