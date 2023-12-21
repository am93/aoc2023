import fs from 'fs'

const MOVES = [[0,1], [1,0], [0,-1], [-1,0]];

function getNeighbs(grid) {
  let rowLen = grid.length;
  let colLen = grid[0].length;
  let graph = {}
  for(let rowIdx = 0; rowIdx < rowLen; rowIdx++) {
    for(let colIdx = 0; colIdx < colLen; colIdx++) {
      let neigh = MOVES.map((m) => [(m[0]+rowIdx) % rowLen, (m[1]+colIdx) % colLen])
      .filter((l) => (l[0] > -1 & l[0] < rowLen & l[1] > -1 & l[1] < colLen))
      .filter((l) => grid[l[0]][l[1]] == '.' || grid[l[0]][l[1]] == 'S')
      .map((l) => l[0]+","+l[1]);
      graph[rowIdx+","+colIdx] = neigh;
    }
  }
  return graph;
}

function getDestCount(graph, start, steps) {
  let locSet = new Set();
  locSet.add(start)
  for(let idx = 0; idx < steps; idx++) {
    let tempSet = new Set();
    for(let crr of locSet.values()) {
      graph[crr].forEach((x) => tempSet.add(x));
    }
    locSet = new Set(tempSet);
  }
  return locSet.size;
}

function getDestCount2(start, steps, maxRow, grid) {
  let locSet = new Set();
  let points = []
  locSet.add(start)
  for(let idx = 0; idx < steps; idx++) {
    let tempSet = new Set();
    for(let crr of locSet.values()) {
      for(let m of MOVES) {
        let np = crr.split(',').map((c,i) => parseInt(c)+m[i]);
        if(grid[(np[0]+maxRow*3)%maxRow][(np[1]+maxRow*3)%maxRow] != '#'){
          tempSet.add(np[0]+","+np[1]);
        }  
      }
    }
    locSet = new Set(tempSet);
    if ((idx+1) % maxRow == steps % maxRow) {
      points.push(locSet.size);
    }
    if (points.length == 3){
      break;
    }
  }
  // DISCLAIMER: following formula (next 5 lines) was not my idea
  let a = (points[2]+points[0]-2*points[1])/2;
  let b = points[1]-points[0]-a;
  let c = points[0];
  let n = Math.floor(steps/maxRow);
  return a*n**2 + b*n +c
}

function partOne(grid, numSteps) {
  let rowLen = grid.length;
  let colLen = grid[0].length;
  let start = null;
  
  for(let rowIdx = 0; rowIdx < rowLen; rowIdx++) {
    for(let colIdx = 0; colIdx < colLen; colIdx++) {
      if(grid[rowIdx][colIdx] == 'S') start = rowIdx+","+colIdx;
    }
  }
  
  let graph = getNeighbs(grid);
  return getDestCount(graph, start, numSteps);
}

function partTwo(grid, numSteps) {
  let rowLen = grid.length;
  let colLen = grid[0].length;
  let start = null;
  
  for(let rowIdx = 0; rowIdx < rowLen; rowIdx++) {
    for(let colIdx = 0; colIdx < colLen; colIdx++) {
      if(grid[rowIdx][colIdx] == 'S') start = rowIdx+","+colIdx;
    }
  }
  
  return getDestCount2(start, numSteps, rowLen, grid);
}

const sample = fs.readFileSync('./sample.txt', 'utf-8').trim().split('\n');
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
console.log('Part 1 sample:', partOne(sample, 6));
console.log('Part 1       :', partOne(input, 64));
console.log('Part 2       :', partTwo(input, 26501365));