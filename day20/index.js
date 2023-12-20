import fs from 'fs'

let counts = {0:0, 1:0}
let turnedOn = false;

function ddIns(key, sKey, val, dict) {
	if(key in dict) dict[key][sKey] = val;
	else {
    dict[key] = {};
    dict[key][sKey] = val;
  } 
	return dict;
}

function pushToEval(crr, pul, conns, cj, cjIns, evalList) {
  let tcj = structuredClone(cjIns);
  for(let n of conns[crr]) {
    if(cj.indexOf(n) > -1){
      tcj[n][crr] = pul;
    } 
    evalList.push([n, pul, tcj]);
  }
  return evalList;
}

function pushButton(evalList, ff, cj, conns) {
  let [crr, p, tcj] = [null, null, null];
  while(evalList.length > 0){
    [crr, p, tcj] = evalList.shift();
    if(crr == 'rx' & p == 0) turnedOn = true;
    counts[p] += 1;
    if(crr == 'output') continue;
    if(crr in ff){
      if(p == 1) continue;
      ff[crr] = (!ff[crr]/1);
      evalList = pushToEval(crr, ff[crr], conns, cj, tcj, evalList);
      continue
    }
    if(cj.indexOf(crr) > -1){
      let allHigh = true;
      for(let inp in tcj[crr]) {
        allHigh = allHigh & tcj[crr][inp];
      }
      evalList = pushToEval(crr, (!allHigh/1), conns, cj, tcj, evalList);
    }
    if(crr == 'broadcaster'){
      evalList = pushToEval(crr, p, conns, cj, tcj, evalList);
    }
  }

  return tcj;
}

function partOne(prop, loopCount) {
  counts = {0:0, 1:0};
  turnedOn = false;
  let conns = {}
  let ff = {}
  let cj = []
  let cjIns = {}
  
  for(let line of prop){
    let l = line.split(' -> ').map((x, i) => i > 0 ? x.split(', ') : x);
    if(l[0][0] == '%'){
      ff[l[0].substring(1)] = 0;
      conns[l[0].substring(1)] = l[1];
    }
    else if(l[0][0] == '&'){
      cj.push(l[0].substring(1));
      conns[l[0].substring(1)] = l[1];
    }
    else conns[l[0]] = l[1];
  }

  for(let c of cj) {
    for(let idx in conns) {
      if(c == idx) continue;
      if(conns[idx].indexOf(c) > -1) 
        cjIns = ddIns(c, idx, 0, cjIns);
    }
  }

  while(loopCount > 0){
    loopCount--;
    cjIns = pushButton([['broadcaster', 0, structuredClone(cjIns)]], ff, cj, conns);
    if(turnedOn) console.log(1000 - loop);
  }
  return counts[0] * counts[1];
}

const sample = fs.readFileSync('./sample.txt', 'utf-8').trim().split('\n');
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
console.log('Part 1 sample:', partOne(sample, 1000));
console.log('Part 1       :', partOne(input, 1000));
console.log('Part 2       :', partOne(input, 1000000000));