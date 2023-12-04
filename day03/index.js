import fs from 'fs'

function numberRange (start, end) {
  return new Array(end - start).fill().map((_, i) => i + start);
}

function saveSymbolNumber(row, col, sym, num, symbols) {
  if(row+'-'+col in symbols){
    symbols[row+'-'+col][1].push(num);
  }
  else {
    symbols[row+'-'+col] = [sym, [num]];
  }
  return symbols;
}

function detectSymbols(num, grid, rowIdx, startCol, endCol, maxCol, maxRow, symbols) {
  let symbolFound = false;
  if(startCol > 0 & grid[rowIdx][startCol-1] != '.') {
    symbols = saveSymbolNumber(rowIdx, startCol - 1, grid[rowIdx][startCol-1], num, symbols);
    symbolFound = true;
  }
  if(endCol < maxCol & grid[rowIdx][endCol] != '.') {
    symbols = saveSymbolNumber(rowIdx, endCol, grid[rowIdx][endCol], num, symbols);
    symbolFound = true;
  }
  if(rowIdx > 0) {
    for(let col of numberRange(Math.max(0, startCol-1), Math.min(endCol+1, maxCol))) {
      if(isNaN(parseInt(grid[rowIdx-1][col])) & grid[rowIdx-1][col] != '.'){
        symbols = saveSymbolNumber(rowIdx-1, col, grid[rowIdx-1][col], num, symbols);
        symbolFound = true;
      }
    }
  }
  if(rowIdx < maxRow){
    for(let col of numberRange(Math.max(0, startCol-1), Math.min(endCol+1, maxCol))) {
      if(isNaN(parseInt(grid[rowIdx+1][col])) & grid[rowIdx+1][col] != '.') {
        symbols = saveSymbolNumber(rowIdx+1, col, grid[rowIdx+1][col], num, symbols);
        symbolFound = true;
      }
    }
  }
  return [symbolFound, symbols]
}

function solve(filename) {
  const grid = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  const maxCol = grid[0].length - 1;
  const maxRow = grid.length - 1;
  let symbols = {};
  let correctNumbers = [];
  
  for(let rowIdx = 0; rowIdx <= maxRow; rowIdx++) {
    let startIdx = -1;
    let num = null;
    for(let colIdx = 0; colIdx <= maxCol; colIdx++) {
        if(!isNaN(parseInt(grid[rowIdx][colIdx])) & startIdx == -1) {
            startIdx = colIdx;
        }
        else if((isNaN(parseInt(grid[rowIdx][colIdx])) & startIdx > -1) || (colIdx == maxCol & startIdx > -1)) {
            if (!isNaN(parseInt(grid[rowIdx][colIdx]))) {
              num = parseInt(grid[rowIdx].substring(startIdx, colIdx+1));
            }
            else {
              num = parseInt(grid[rowIdx].substring(startIdx, colIdx));
            }
            //console.log(rowIdx+'-'+colIdx+': '+num+' ('+startIdx+' to '+colIdx+')');
            let detected = false;
            [detected, symbols] = detectSymbols(num, grid, rowIdx, startIdx, colIdx, maxCol, maxRow, symbols);
            if(detected) {
                correctNumbers.push(num);
            }
            startIdx = -1;
        }
    }
  }
  console.log('Part1: '+correctNumbers.reduce((sum, val) => sum + val));

  let totalGearRation = 0;
  for(let symCoord in symbols) {
    if(symbols[symCoord][0] == '*' & symbols[symCoord][1].length == 2) {
      totalGearRation += (symbols[symCoord][1].reduce((m, x) => m*x, 1));
    }
  }
  console.log('Part2: '+totalGearRation);

}

console.log('Sample: ')
solve('./sample.txt');
console.log('Input: ')
solve('./input.txt');