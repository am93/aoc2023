import fs from 'fs'

const NUMBER_TXTS = [['one',1], ['two',2], ['three',3], ['four',4], 
                     ['five',5], ['six', 6], ['seven', 7], ['eight', 8], 
                     ['nine', 9], ['1',1], ['2',2], ['3',3], ['4',4], 
                     ['5',5], ['6',6], ['7',7], ['8',8], ['9',9]]

function partOne(filename) {
  const lines = fs.readFileSync(filename, 'utf-8').trim().split('\n')
  const values = lines
    .map((line) => {
      let first = line.split('').find((v) => !Number.isNaN(Number(v)));
      let last = line.split('').findLast((v) => !Number.isNaN(Number(v)));
      return Number(first+last);
    });

  return values
    .reduce((sum, val) => {
      return sum + val
    });
}

function partTwo(filename) {
  const lines = fs.readFileSync(filename, 'utf-8').trim().split('\n')
  const values = lines
    .map((line) => {
      let nums = NUMBER_TXTS
        .map((nmbr) => [nmbr[1], line.indexOf(nmbr[0]), line.lastIndexOf(nmbr[0])])
        .filter(([num, idx, idxLast]) => idx >= 0 || idxLast >= 0)
        .sort((a, b) => a[1] - b[1]);
      const firstNum = nums[0][0];
      const lastNum = nums.sort((a, b) => b[2] - a[2])[0][0];
      return Number(''+firstNum+lastNum);
    });
  return values
    .map((rowVal) => {
      if(rowVal.length > 2) {
        return Number(rowVal.slice(0,1) + rowVal.slice(-1));
      }
      return Number(rowVal);
    })
    .reduce((sum, val) => sum + val);
}


console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample2.txt'));
console.log('Part 2       :', partTwo('./input.txt'));