import fs from 'fs'

let memory = {};

function validateSpring(s, config) {
  let detected = []
  let crr = 0
  s.forEach((s) => {
    if(s == '#') crr++;
    if((s == '.' || s == '?') & crr > 0) {
      detected.push(crr);
      crr = 0;
    }
  });
  if(crr > 0) detected.push(crr);
  return JSON.stringify(detected) == JSON.stringify(config);
}

function combinations(array) {
  return new Array(1 << array.length).fill().map(
    (e1, i) => array.filter((e2, j) => i & 1 << j));
}

function allIndOf(str, c) {
  return str.split('').map((s, idx) => s == c ? idx : -1).filter((i) => i >= 0);
}

function recFind(sprs, broken, i, bi, crr) {
  let key = i+' '+bi+' '+crr;
  if (key in memory) {
    return memory[key];
  }
  if (i == sprs.length) {
    if ((bi == broken.length && crr == 0) || 
        (bi == broken.length - 1 && broken[bi] == crr)) {
      return 1;
    } 
    else {
      return 0;
    }
  }
  let sum = 0;
  for (let c of ['.', '#']) {
    if (sprs[i] == c || sprs[i] == '?') {
      if (c == '.' && crr == 0) {
        sum += recFind(sprs, broken, i + 1, bi, 0);
      } else if (c == '.' && crr > 0 && bi < broken.length && broken[bi] == crr) {
        sum += recFind(sprs, broken, i + 1, bi + 1, 0);
      } else if (c == '#') {
        sum += recFind(sprs, broken, i + 1, bi, crr + 1);
      }
    }
  }
  memory[key] = sum;
  return sum;
}

// too slow for part2 :D 
function partOne(filename) {
  const springs = fs.readFileSync(filename, 'utf-8').trim().split('\n').map((line) => line.split(' '));
  let numByRow = springs.map((row) => {
    let config = row[1].split(',').map((x) => parseInt(x))
    let unknown = allIndOf(row[0], '?')
    let validSols = combinations(unknown).map((c) => {
      let tempSpr = row[0].split('');
      c.forEach((idx) => tempSpr[idx] = '#');
      return validateSpring(tempSpr, config);
    });
    return validSols.reduce((sum, val) => sum + val, 0);
  });
  return numByRow.reduce((sum, val) => sum + val);
}

function partTwo(filename) {
  const springs = fs.readFileSync(filename, 'utf-8').trim().split('\n').map((line) => line.split(' '));
  let numByRow = springs.map((row) => {
    let multiConfig = Array(5).fill(row[1]).join(',');
    let multiSpring = Array(5).fill(row[0]).join('?');
    let config = multiConfig.split(',').map((x) => parseInt(x));
    memory = {}
    return recFind(multiSpring, config, 0, 0, 0);
  });
  return numByRow.reduce((sum, val) => sum + val);
}

console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));