import fs from 'fs'

function evalMatch(t, matchTime, matchRecord) {
    return Number(((matchTime - t) * t) > matchRecord);
}

function partOne(filename) {
  const matches = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                .map((line) => line.slice(line.indexOf(':')+2))
                .map((line) => line.split(' ').filter((n) => !isNaN(parseInt(n))).map((n) => parseInt(n)))
  let results = []
  
  for(let mIdx in matches[0]) {
    let mTime = matches[0][mIdx];
    let mDist = matches[1][mIdx];
    results.push(Array.from(Array(mTime).keys()).reduce((sum, t) => sum + evalMatch(t, mTime, mDist)));
  }

  return results.reduce((mlt, r) => mlt * r, 1);
}

function partTwo(filename) {
    const matches = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                  .map((line) => line.slice(line.indexOf(':')+2))
                  .map((line) => parseInt(line.replaceAll(' ','')));
    let results = []  
    let mTime = matches[0];
    let mDist = matches[1];
    results.push(Array.from(Array(mTime).keys()).reduce((sum, t) => sum + evalMatch(t, mTime, mDist)));
    return results.reduce((mlt, r) => mlt * r, 1);
}

console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));