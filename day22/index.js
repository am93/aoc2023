import fs from 'fs'

function ddGet(dict, key, deflt=0) {
  if(key in dict) return dict[key]
  return deflt;
}

function doFall(tallest, brick) {
  let peak = -1;
  for(let x = brick[0]; x <= brick[3]; x++){
    for(let y = brick[1]; y <= brick[4]; y++){
      let crrPeak = ddGet(tallest, [x,y].toString());
      peak = peak < crrPeak ? crrPeak : peak;
    }
  }
  let fall = Math.max(brick[2] - peak - 1, 0);
  return [brick[0],brick[1],brick[2]-fall,
          brick[3],brick[4],brick[5]-fall];
}

function drop(tower) {
  let tallest = {}
  let nTower = []
  let falls = 0
  for(let brick of tower){
    let nBrick = doFall(tallest, brick);
    if(nBrick[2] != brick[2]) falls++;
    nTower.push(nBrick);
    for(let x = brick[0]; x <= brick[3]; x++){
      for(let y = brick[1]; y <= brick[4]; y++){
        tallest[[x,y].toString()] = nBrick[5];
      }
    }
  }
  return [falls, nTower];
}

function solve(bricks) {
  let sortedBricks = bricks.sort((a,b) => a[2] - b[2]);
  let nTower = null;
  let falls = 0;
  [falls, nTower] = drop(sortedBricks);
  let [p1, p2] = [0, 0]
  for(let idx in nTower){
    let tmpTower = nTower.toSpliced(idx, 1);
    [falls, tmpTower] = drop(tmpTower);
    if(falls == 0) p1++;
    else p2 += falls;
  }
  console.log(' Part1:',p1);
  console.log(' Part2:',p2);
}

const sample = fs.readFileSync('sample.txt', 'utf8').split('\n')
.map(line => line.replace('~',',').split(',').map(Number));
const input = fs.readFileSync('input.txt', 'utf8').split('\n')
.map(line => line.replace('~',',').split(',').map(Number));
console.log('Sample:');
solve(sample);
console.log('Input:');
solve(input);