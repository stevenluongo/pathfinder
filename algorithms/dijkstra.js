export const dijkstra = (START_NODE, FINISH_NODE, board) => new Promise(resolve => {
    const visitedSet = [];
    const unvisitedSet = fillSet(board);
    START_NODE.distance = 0;
    while(unvisitedSet.length) {
        //sort nodes by distance
        sortNodes(unvisitedSet);
        //set target node to node with lowest distance
        let targetNode = unvisitedSet.shift();
        
        if(targetNode.distance === Infinity) { 
            resolve(visitedSet);
            return;
        }
        
        targetNode.isVisited = true;
        
        visitedSet.push(targetNode);
        
        if(targetNode.isWall) {
            continue;
        }
        
        if(targetNode === FINISH_NODE) {
            resolve(visitedSet);
            return;
        }
        
        updateSet(targetNode, board);
    }
}) 



const fillSet = (board) => {
    let set = [];
    board.forEach(row => {
        row.forEach(node => {
            node.isVisited = false;
            node.distance = Infinity;
            node.previousNode = undefined;
            set.push(node);
        })
    })
    return set;
}


const sortNodes = (unvisitedSet) => {
    unvisitedSet.sort((a, b) => a.distance - b.distance)
}


const updateSet = (targetNode, board) => {
    const neighbors = getNeighbors(targetNode, board);
    neighbors.forEach(neighbor => {
        neighbor.distance = targetNode.distance + 1;
        neighbor.previousNode = targetNode;
    })
}


const getNeighbors = (targetNode, board) => {
    const {col, row} = targetNode;
    let neighbors = [];
    let targetNeighbor;

    if(row > 0) {
        targetNeighbor = board[row - 1][col];
        neighbors.push(targetNeighbor);
    }
    if(row < board.length - 1) {
        targetNeighbor = board[row + 1][col];
        neighbors.push(targetNeighbor);
    }
    if(col > 0) {
        targetNeighbor = board[row][col - 1];
        neighbors.push(targetNeighbor);
    }
    if(col < board[0].length - 1) {
        targetNeighbor = board[row][col + 1];
        neighbors.push(targetNeighbor)
    }

    return neighbors.filter(neighbor => !neighbor.isVisited);
}


export const getNodesInOrder = (FINISH_NODE) => {
    let arr = [];
    let targetNode = FINISH_NODE.previousNode;
    arr.push(targetNode);
    if(!targetNode) {
        return;
    }
    while(targetNode.previousNode !== undefined) {
        arr.push(targetNode.previousNode);
        targetNode = targetNode.previousNode;
    }
    //remove start node
    arr.pop()
    return arr;
}