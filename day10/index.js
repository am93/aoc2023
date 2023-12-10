import fs from 'fs'

function genCoordString(rowIdx, colIdx) {
  return ''+parseInt(rowIdx)+'-'+parseInt(colIdx);
}

function solve(filename) {
  let grid = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  const maxCol = grid[0].length - 1;
  const maxRow = grid.length - 1;

  let startCoord = null;
  let gridMoves = {}
  
  for(let rowIdx = 0; rowIdx <= maxRow; rowIdx++) {
    for(let colIdx = 0; colIdx <= maxCol; colIdx++) {
      let crrCoord = rowIdx+'-'+colIdx;
      let validMoves = []
      switch(grid[rowIdx][colIdx]) {
        case '|':
          if(rowIdx > 0) validMoves.push(genCoordString(rowIdx-1, colIdx));
          if(rowIdx < maxRow) validMoves.push(genCoordString(rowIdx+1, colIdx));
          break;
        case '-':
          if(colIdx > 0) validMoves.push(genCoordString(rowIdx, colIdx-1));
          if(colIdx < maxCol) validMoves.push(genCoordString(rowIdx, colIdx+1));
          break;
        case 'L':
          if(rowIdx > 0) validMoves.push(genCoordString(rowIdx-1, colIdx));
          if(colIdx < maxCol) validMoves.push(genCoordString(rowIdx, colIdx+1));
          break;
        case 'J':
          if(rowIdx > 0) validMoves.push(genCoordString(rowIdx-1, colIdx));
          if(colIdx > 0) validMoves.push(genCoordString(rowIdx, colIdx-1));
          break;
        case '7':
          if(colIdx > 0) validMoves.push(genCoordString(rowIdx, colIdx-1));
          if(rowIdx < maxRow) validMoves.push(genCoordString(rowIdx+1, colIdx));
          break;   
        case 'F':
          if(colIdx < maxCol) validMoves.push(genCoordString(rowIdx, colIdx+1));
          if(rowIdx < maxRow) validMoves.push(genCoordString(rowIdx+1, colIdx));
          break;
        case 'S':
          startCoord = genCoordString(rowIdx, colIdx);
          if(rowIdx > 0 & (grid[rowIdx-1][colIdx] == '|' || 
                           grid[rowIdx-1][colIdx] == '7' ||
                           grid[rowIdx-1][colIdx] == 'F'))
            validMoves.push(genCoordString(rowIdx-1, colIdx));
          if(rowIdx < maxRow & (grid[rowIdx+1][colIdx] == '|' || 
                                grid[rowIdx+1][colIdx] == 'L' ||
                                grid[rowIdx+1][colIdx] == 'J'))
            validMoves.push(genCoordString(rowIdx+1, colIdx));
          if(colIdx > 0 & (grid[rowIdx][colIdx-1] == '-' || 
                           grid[rowIdx][colIdx-1] == 'L' ||
                           grid[rowIdx][colIdx-1] == 'F'))
            validMoves.push(genCoordString(rowIdx, colIdx-1));
          if(colIdx < maxCol & (grid[rowIdx][colIdx+1] == '-' || 
                                grid[rowIdx][colIdx+1] == 'J' ||
                                grid[rowIdx][colIdx+1] == '7'))
            validMoves.push(genCoordString(rowIdx, colIdx+1));
          break;
        default:
          null;
      }
      gridMoves[crrCoord] = validMoves;
      
    }
  }

  // PART 1 - path discovery
  let crr = startCoord;
  let prev = null;
  let next = null;
  let pathLen = 0;
  let pipeline = []
  while(next != startCoord) {
    next = gridMoves[crr].filter((x) => x != prev)[0];
    prev = crr;
    crr = next;
    pipeline.push(next);
    pathLen++;
  } 

  console.log('  Part1: '+ Math.ceil(pathLen / 2));

  // PART 2 - ray intersections
  for(let rowIdx = 0; rowIdx <= maxRow; rowIdx++) {
    for(let colIdx = 0; colIdx <= maxCol; colIdx++) {
      if(pipeline.indexOf(genCoordString(rowIdx, colIdx)) < 0) {
        let t = grid[rowIdx].split('')
        t[colIdx] = '.'
        grid[rowIdx] = t.join('');
      }
    }
  }

  let re1 = RegExp('F-*7|L-*J', 'g');
  let re2 = RegExp('F-*J|L-*7', 'g');
  let ans = 0;
  for(let row of grid){
    let interior = 0
    row = row.replace('S','J'); // this is input specific - should be generalized
    row = row.replaceAll(re1, '');
    row = row.replaceAll(re2,'|');
    for(let c of row){
      if(c == "|") interior++;
      if(interior % 2 == 1 & c == '.') ans++;
    }
  }

  console.log('  Part2: '+ans);
}

console.log('Sample: ')
solve('./sample.txt');
console.log('Input: ')
solve('./input.txt');