import fs from 'fs'

function indOfDiff(arr1, arr2) {
  let diffs = []
  for(let idx = 0; idx < arr1.length; idx++) {
    if(arr1[idx] != arr2[idx]) diffs.push(idx);
  }
  return diffs;
}

function smudge(pattern, row, col) {
  let temp = pattern[row].split('');
  temp[col] = temp[col] == '#' ? '.' : '#';
  pattern[row] = temp.join('');
  return pattern;
}

function findReflRange(ptrn, idx) {
  let sIdx = idx;
  let oIdx = idx+1;
  while(idx >= 0 & oIdx < ptrn.length) {
    if(ptrn[idx] == ptrn[oIdx]) {
      idx--;
      oIdx++;
    }
    else {
      return -1;
    }
  }
  return sIdx;
}

function reflWithSmudge(ptrn, idx, errs) {
  let sIdx = idx;
  let oIdx = idx+1;
  let smudgeCol = -1;
  let smudgeRow = -1;
  while(idx >= 0 & oIdx < ptrn.length) {
    let diffs = indOfDiff(ptrn[idx], ptrn[oIdx]);
    if(diffs.length == 0) {
      idx--;
      oIdx++;
    }
    else if (diffs.length == 1 && errs == 0) {
      errs = 1;
      smudgeCol = diffs[0];
      smudgeRow = idx;
      idx--;
      oIdx++;
    }
    else {
      return [-1, -1, -1];
    }
  }
  return [sIdx, smudgeCol, smudgeRow];
}

function transposePtrn(ptrn) {
  let trans = []
  for(let cIdx = 0; cIdx < ptrn[0].length; cIdx++) {
    trans.push(ptrn.reduce((acc, v) => {acc.push(v[cIdx]); return acc;}, []).join(''))
  }
  return trans;
}

function partOne(filename) {
  const patterns = fs.readFileSync(filename, 'utf-8').trim().split('\n\n').map((pat) => pat.split('\n'));
  let total = [];

  for (let pattern of patterns) {
    for(let rIdx = 0; rIdx < pattern.length - 1; rIdx++) {
      if(pattern[rIdx] == pattern[rIdx+1]) {
        total.push(100 * (findReflRange(pattern, rIdx)+1));
      }
    }
    let tPattern = transposePtrn(pattern);
    for(let rIdx = 0; rIdx < tPattern.length - 1; rIdx++) {
      if(tPattern[rIdx] == tPattern[rIdx+1]) {
        total.push((findReflRange(tPattern, rIdx)+1));
      }
    }
  }
  //console.log(total);
  return total.reduce((sum,v) => sum +v)
}

function partTwo(filename) {
  const patterns = fs.readFileSync(filename, 'utf-8').trim().split('\n\n').map((pat) => pat.split('\n'));
  let total = [];

  for (let pattern of patterns) {
    let smudgeCnt = 0
    let reflFound = false;
    for(let rIdx = 0; rIdx < pattern.length - 1; rIdx++) {
      let res = reflWithSmudge(pattern, rIdx, smudgeCnt);
      if(res[0] > -1) {
        if(res[1] > -1) {
          total.push(100 * (res[0]+1));
          smudgeCnt++;
          pattern = smudge(pattern, res[2], res[1],);
          reflFound = true
        }
      }
    }
    smudgeCnt = 0;
    let tPattern = transposePtrn(pattern);
    for(let rIdx = 0; rIdx < tPattern.length - 1; rIdx++) {
      let res = reflWithSmudge(tPattern, rIdx, smudgeCnt);
      if(res[0] > -1) {
        if(res[1] > -1) {
          total.push((res[0]+1));
          tPattern = smudge(tPattern, res[2], res[1]);
          smudgeCnt++;
        }
      }
    }
  }
  return total.reduce((sum,v) => sum +v)
}

console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));