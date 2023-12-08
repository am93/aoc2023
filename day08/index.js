import fs from 'fs'

const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b
const lcmAll = (ns) => ns .reduce (lcm, 1)

function partOne(filename, crrElem = 'AAA', onlyLast = false) {
  let pathLen = 0;
  const network = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                .map((line) => line.replace(' = (', '-').replace(', ','-').replace(')',''))
                .filter((line) => line.length > 1);
  const dirs = network.shift().replaceAll('R', '1').replaceAll('L','0');
  const nodes = network.map((line) => line.split('-')).reduce((acc, val) => {
    acc[val[0]] = [val[1], val[2]];
    return acc;
    }, {});

  while(true) {
    let dir = dirs[pathLen % dirs.length];
    crrElem = nodes[crrElem][parseInt(dir)];
    pathLen += 1;
    if(crrElem === 'ZZZ' || (onlyLast & crrElem.split('')[2] == 'Z'))
      break;
  }
  return pathLen;
}

function partTwo(filename) {
  const network = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                .map((line) => line.replace(' = (', '-').replace(', ','-').replace(')',''))
                .filter((line) => line.length > 1);
  const nodes = network.map((line) => line.split('-')).reduce((acc, val) => {
    acc[val[0]] = [val[1], val[2]];
    return acc;
    }, {});

  let crrElems = Object.keys(nodes).filter((n) => n.split('')[2] == 'A');
  let pathLens = crrElems.map((c) => partOne(filename, c, true));
  return lcmAll(pathLens);
}


console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample2.txt'));
console.log('Part 2       :', partTwo('./input.txt'));