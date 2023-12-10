import fs from 'fs'

function partOne(filename) {
  const ground = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  let mapped = ground.map((g) => {
    let crrIdx = 0;
    let arr = [g.split(' ').map((x) => parseInt(x))];
    while(!arr[crrIdx].every((x) => x == 0)){
      let tempArr = []
      for(let idx = 0; idx < arr[crrIdx].length-1; idx++) {
        tempArr.push(arr[crrIdx][idx+1] - arr[crrIdx][idx]);
      }
      arr.push(tempArr);
      crrIdx++;
    }
    return arr.reduce((sum, a) => sum + a.pop(), 0);
  });
  return mapped.reduce((sum, val) => sum + val);
}

function partTwo(filename) {
  const ground = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  let mapped = ground.map((g) => {
    let crrIdx = 0;
    let arr = [g.split(' ').map((x) => parseInt(x))];
    while(!arr[crrIdx].every((x) => x == 0)){
      let tempArr = []
      for(let idx = 0; idx < arr[crrIdx].length-1; idx++) {
        tempArr.push(arr[crrIdx][idx+1] - arr[crrIdx][idx]);
      }
      if(!tempArr.every((x) => x == 0)) arr.push(tempArr);
      else break;
      crrIdx++;
    }
    return arr.reverse().reduce((acc, a) => a.shift() - acc, 0);
  });
  return mapped.reduce((sum, val) => sum + val);
}

console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));