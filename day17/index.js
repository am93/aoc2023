import fs from 'fs'
import Heap from 'heap'

function solve(grid, isSecond) {
  let e = [grid[0].length - 1, grid.length - 1];
  
  const DIRS = {'>': [1, 0], 'v': [0, 1], '^': [0, -1], '<': [-1, 0]};
  const OPPOSITE = {'<': '>', '>': '<', 'v': '^', '^': 'v'};
  
  let toVisit = new Heap(function(a, b) {
    return a[0] - b[0];
  });
  toVisit.push([0, '>', [0, 0]]);
  toVisit.push([0, 'v', [0, 0]]);
  
  let seen = new Set();
  
  while (!toVisit.empty()) {
    let [cl, cd, cp] = toVisit.pop();
    if (seen.has(cp.toString() + cd)) {
      continue;
    }
    seen.add(cp.toString() + cd);
    for (let d in DIRS) {
      let n_p = [cp[0] + DIRS[d][0], cp[1] + DIRS[d][1]];
      // PART 1
      if (!isSecond & (
        n_p[0] < 0 || n_p[0] >= grid[0].length || 
        n_p[1] < 0 || n_p[1] >= grid.length ||
        (d == cd.slice(-1) & cd.length == 3) || 
        cd.slice(-1) == OPPOSITE[d] 
      )) continue;
      // PART 2
      if (isSecond & (
        n_p[0] < 0 || n_p[0] >= grid[0].length ||
        n_p[1] < 0 || n_p[1] >= grid.length ||
        (d == cd.slice(-1) && cd.length == 10) ||
        (d != cd.slice(-1) && cd.length < 4) ||
        cd.slice(-1) == OPPOSITE[d]
      )) continue;
        
      let nd = cd[cd.length - 1] == d ? cd + d : d;
      if (seen.has(n_p.toString() + nd)) continue;
      if (n_p[0] == e[0] & n_p[1] == e[1]) {
        return cl + grid[n_p[1]][n_p[0]];
      }
      toVisit.push([cl + grid[n_p[1]][n_p[0]], nd, n_p]);
    }
  }
}

const sample = fs.readFileSync('sample.txt', 'utf8').split('\n').map(line => line.split('').map(Number));
const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(line => line.split('').map(Number));
console.log('Part 1 sample:', solve(sample, false));
console.log('Part 1       :', solve(input, false));
console.log('Part 2 sample:', solve(sample, true));
console.log('Part 2       :', solve(input, true));