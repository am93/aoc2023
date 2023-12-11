import fs from 'fs'

function defaultDictIns(key, val, dict) {
  if(key in dict) {
    dict[key].push(val);
  }
  else {
    dict[key] = [val];
  }
  return dict;
}

function solve(filename, expSize) {
  const cosmos = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  let maxRow = cosmos.length - 1;
  let maxCol = cosmos[0].length - 1;
  let gal = []
  let galByR = {}
  let galByC = {}

  for(let rowIdx = 0; rowIdx <= maxRow; rowIdx++) {
    for(let colIdx = 0; colIdx <= maxCol; colIdx++) {
      if(cosmos[rowIdx][colIdx] == '#'){
        gal.push([rowIdx,colIdx]);
        galByR = defaultDictIns(rowIdx, [rowIdx, colIdx], galByR);
        galByC = defaultDictIns(colIdx, [rowIdx, colIdx], galByC);
      }
    }
  }

  for(let rowIdx = maxRow; rowIdx >=  0; rowIdx--) {
    if (!(rowIdx in galByR)) {
      gal.map((g) => {
        if(g[0] > rowIdx) {
          g[0] += expSize;
        }
        return g;
      });
    }
  }

  for(let colIdx = maxCol; colIdx >= 0; colIdx--) {
    if (!(colIdx in galByC)) {
      gal.map((g) => {
        if(g[1] > colIdx) {
          g[1] += expSize;
        }
        return g;
      });
    }
  }

  let totalDist = [];

  for(let galIdx = 0; galIdx < gal.length - 1; galIdx++) {
    for(let gal2Idx = galIdx + 1; gal2Idx < gal.length; gal2Idx++) {
      totalDist.push(Math.abs(gal[galIdx][0] - gal[gal2Idx][0]) + 
                     Math.abs(gal[galIdx][1] - gal[gal2Idx][1]));
    }
  }
  return totalDist.reduce((sum, v) => sum + v);
}

console.log('Part 1 sample:', solve('./sample.txt', 1));
console.log('Part 1       :', solve('./input.txt', 1));
console.log('Part 2 sample:', solve('./sample.txt', 99));
console.log('Part 2       :', solve('./input.txt', 999999));