import fs from 'fs'

const DIRS = [[0,1], [1, 0], [0, -1], [-1, 0]];
const ALLOWED = {'>': [0,1], '<': [0, -1], 'v': [1, 0], '^': [-1, 0]}

function s(crd) {
  return crd[0]+','+crd[1];
}

function neighbours(grid, r, c, maxRow, maxCol, slp) {
  let ngh = []
  for(let d of DIRS) {
    if(slp && grid[r][c] != '.' && s(ALLOWED[grid[r][c]]) != s(d)){
      continue;
    }
    let [nr, nc] = [r+d[0], c+d[1]]
    if(nr > -1 && nr < maxRow && nc > -1 && nc < maxCol && grid[nr][nc] != '#'){
      ngh.push([nr,nc])
    }
  }
  return ngh;
}

function trailLen(edges, st, h) {
  let count = 1;
  while(edges[s(h)].length == 2){
    count++;
    let nxt = edges[s(h)].filter((n) => s(n[1]) != st)[0][1];
    st = h;
    h = nxt;
  }
  return [count, h];
}

function trails(grid, maxRow, maxCol, slp) {
  let edges = {}
  for(let r = 0; r < maxRow; r++){
    for(let c = 0; c < maxCol; c++){
      if(grid[r][c] != '#') {
        edges[s([r,c])] = neighbours(grid, r, c, maxRow, maxCol, slp).map((n) => [1, n]);
      }
    }
  }
  
  let optEdges = {}
  for(let crdS in edges){
    if(edges[crdS].length != 2) {
      optEdges[crdS] = edges[crdS].map((n) => trailLen(edges, crdS, n[1]));
    }
  }
  return optEdges;
}

function dfs(edges, strt, end) {
  let seen = new Set();
  seen.add(s(strt));
  let stack = [[strt, 0, structuredClone(seen)]]
  let mx = 0;
  while (stack.length > 0) {
    let [pos, dist, seenC] = stack.pop();
    if(s(pos) == s(end)){
      mx = Math.max(mx, dist);
    }
    
    for(let [d, nxt] of edges[s(pos)]){
      if(!seenC.has(s(nxt))){
        let nSeen = structuredClone(seenC);
        nSeen.add(s(nxt));
        stack.push([nxt, dist+d, nSeen]);
      }
    }
  }
  return mx;
}

function solve(grid, slippery) {
  const maxRow = grid.length;
  const maxCol = grid[0].length;
  console.log(dfs(trails(grid, maxRow, maxCol, slippery), [0,1], [maxRow-1, maxCol-2]));
}

const sample = fs.readFileSync('sample.txt', 'utf8').split('\n');
const input = fs.readFileSync('input.txt', 'utf8').split('\n');
console.log('Sample:');
solve(sample, true);
solve(sample, false);
console.log('Input:');
solve(input, true);
solve(input, false);