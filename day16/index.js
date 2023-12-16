import fs from 'fs'

const MOVES = {'N': [-1, 0], 'W': [0, -1], 'S': [1, 0],'E': [0, 1]}
const DIRMAP = {'\\E':['S'], '\\S':['E'], '\\N':['W'], '\\W':['N'],
                '/E':['N'], '/N':['E'], '/S':['W'], '/W':['S'],
                '|N':['N'], '|S':['S'], '|E':['N','S'], '|W':['N','S'],
                '-E':['E'], '-W':['W'], '-N':['E','W'], '-S':['E','W']};

function partOne(layout, start) {
	let maxRow = layout.length;
	let maxCol = layout[0].length;
	let beamWithDir = new Set()
  let beam = new Set()
  let toExplore = []

  toExplore.push(start);

  while(toExplore.length > 0) {
    let beamDir = toExplore.shift();
    // we know it already
    if(beamWithDir.has(beamDir.toString())){
      continue;
    }
    if(beamDir[0][0] >= 0 && beamDir[0][1] >= 0 &
       beamDir[0][0] < maxRow && beamDir[0][1] < maxCol) {
      beam.add(beamDir[0].toString());
      beamWithDir.add(beamDir.toString());
    }


    let newLoc = [beamDir[0][0] + MOVES[beamDir[1]][0], 
                  beamDir[0][1] + MOVES[beamDir[1]][1]];
    // check location still within grid
    if(newLoc[0] < 0 || newLoc[0] >= maxRow || newLoc[1] < 0 || newLoc[1] >= maxCol) {
      continue;
    }

    if(layout[newLoc[0]][newLoc[1]] == '.'){
      toExplore.push([newLoc, beamDir[1]]);
      continue;
    }
    let locDir = layout[newLoc[0]][newLoc[1]] + beamDir[1];
    DIRMAP[locDir].forEach((d) => toExplore.push([newLoc, d]));
  }

  let bLocs = beam.keys();
  let val = 0;
  while(bLocs.next().value != null) val++;
  return val;
}

function partTwo(layout) {
	let maxRow = layout.length;
	let maxCol = layout[0].length;

  let sols = []
  for(let colIdx = 0; colIdx < maxCol; colIdx++) {
    sols.push(partOne(layout, [[-1, colIdx], 'S']));
  }
  for(let colIdx = 0; colIdx < maxCol; colIdx++) {
    sols.push(partOne(layout, [[maxRow, colIdx], 'N']));
  }
  for(let rowIdx = 0; rowIdx < maxRow; rowIdx++) {
    sols.push(partOne(layout, [[rowIdx, -1], 'E']));
  }
  for(let rowIdx = 0; rowIdx < maxRow; rowIdx++) {
    sols.push(partOne(layout, [[rowIdx, maxCol], 'W']));
  }
  return sols.reduce((acc,v) => acc > v ? acc : v, -1);
}

const sample = fs.readFileSync('./sample.txt', 'utf-8').trim().split('\n');
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
console.log('Part 1 sample:', partOne(sample,[[0,-1],'E']));
console.log('Part 1       :', partOne(input, [[0,-1],'E']));
console.log('Part 2 sample:', partTwo(sample));
console.log('Part 2       :', partTwo(input));