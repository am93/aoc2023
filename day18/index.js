import fs from 'fs'

const DIRS = {'L': [-1, 0], 'R': [1, 0], 'U': [0, -1], 'D': [0, 1],
              '2': [-1, 0], '0': [1, 0], '3': [0, -1], '1': [0, 1]}

function solve(filename) {
  let commands = fs.readFileSync(filename, 'utf-8').trim().split('\n').map((c) => c.split(' '));
  
  let pos = [0, 0];
  let [sum1, sum2] = [0, 0];
  let sumDir = 0;
  
  let posC = [0, 0];
  let [sum1C, sum2C] = [0, 0];
  let sumDirC = 0;
  
  for (let c of commands) {
    let n = parseInt(c[1]);
    let col = c[2];
    
    let dir = DIRS[c[0]];
    
    let nextPos = [pos[0] + dir[0] * n, pos[1] + dir[1] * n];
    sum1 += pos[0] * nextPos[1];
    sum2 += pos[1] * nextPos[0];
    sumDir += n;
    pos = nextPos;
    
    let cleaned = col.replace("(#", "").replace(")", "");
    let lenC = parseInt(cleaned.substring(0, 5), 16);
    let dirC = DIRS[cleaned.charAt(5)];
    
    let nextPosC = [posC[0] + dirC[0] * lenC, posC[1] + dirC[1] * lenC];
    sum1C += posC[0] * nextPosC[1];
    sum2C += posC[1] * nextPosC[0];
    sumDirC += lenC;
    posC = nextPosC;
  }
  
  let area = Math.abs(sum1 - sum2) / 2;
  console.log('  Part1: ',area + sumDir / 2 + 1);

  let areaC = Math.abs(sum1C - sum2C) / 2;
  console.log('  Part2: ',areaC + sumDirC / 2 + 1);
}

console.log('Sample: ')
solve('./sample.txt');
console.log('Input: ')
solve('./input.txt');