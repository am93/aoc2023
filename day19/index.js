import fs from 'fs'

function validCombo(wfIdx, wf, ft, idx) {
  if (wfIdx == 'A') {
    return (ft['x'][1] - ft['x'][0] + 1) *
           (ft['m'][1] - ft['m'][0] + 1) *
           (ft['a'][1] - ft['a'][0] + 1) *
           (ft['s'][1] - ft['s'][0] + 1);
  }
  if (wfIdx == 'R') return 0;
  
  let chck = wf[wfIdx][idx];

  if(chck.length == 1){
    return validCombo(chck[0], wf, ft, 0);
  }

  if(chck[0].indexOf('>') > -1){
    let ops = chck[0].split('>');
    if(ft[ops[0]][0] > parseInt(ops[1])) {
      return validCombo(chck[1], wf, ft, 0);
    }
    if(ft[ops[0]][1] < parseInt(ops[1])) {
      return 0;
    }

    let ftC = structuredClone(ft);
    ftC[ops[0]] = [ft[ops[0]][0], parseInt(ops[1])];
    let p1 = validCombo(wfIdx, wf, ftC, idx+1);

    ftC[ops[0]] = [parseInt(ops[1]) + 1, ft[ops[0]][1]]
    let p2 = validCombo(chck[1], wf, ftC, 0);

    return p1 + p2;
  }


  if(chck[0].indexOf('<') > -1){
    let ops = chck[0].split('<');

    if(ft[ops[0]][0] > parseInt(ops[1])) {
      return 0;
    }
    if(ft[ops[0]][1] < parseInt(ops[1])) {
      return validCombo(chck[1], wf, ft, 0);
    }

    let ftC = structuredClone(ft);
    ftC[ops[0]] = [ft[ops[0]][0], parseInt(ops[1]) - 1];
    let p1 = validCombo(chck[1], wf, ftC, 0);

    ftC[ops[0]] = [parseInt(ops[1]), ft[ops[0]][1]]
    let p2 = validCombo(wfIdx, wf, ftC, idx+1);

    return p1 + p2;
  }
}

function partOne(instrc) {
  let workflow = {}
  let wfMode = true;
  let pieces = []
  for(let line of instrc){
    if(line.length < 2) {
      wfMode = false;
      continue;
    }
    if(wfMode) {
      line = line.replace('{',',').replace('}','').split(',');
      let wIdx = line.shift();
      workflow[wIdx] = line.map((x) => x.split(':'));
    }
    else {
      pieces.push(eval('('+line.replaceAll('=',':')+')'));
    }
  }

  let res = {'A':[], 'R':[]}
  for(let pc of pieces){
    let crrWf = 'in';
    while(crrWf != 'R' & crrWf != 'A') {
      for(let cond of workflow[crrWf]) {
        if(cond.length == 1) {
          crrWf = cond[0];
          break;
        }
        if(eval(cond[0].replace(cond[0][0], pc[cond[0][0]]))) {
          crrWf = cond[1];
          break;
        }
      }
    }
    res[crrWf].push(pc);
  }

  return res['A'].reduce((acc, v) => acc + v['x'] + v['m'] + v['a']+ v['s'], 0);
}

function partTwo(instrc) {
  let workflow = {}

  for(let line of instrc){
    if(line.length < 2) {
      break;
    }
    line = line.replace('{',',').replace('}','').split(',');
    let wIdx = line.shift();
    workflow[wIdx] = line.map((x) => x.split(':'));
  }

  let ft = {'x': [1, 4000], 'm': [1, 4000], 'a': [1, 4000], 's': [1, 4000]};
  return validCombo('in', workflow, ft, 0);
}

const sample = fs.readFileSync('./sample.txt', 'utf-8').trim().split('\n');
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');
console.log('Part 1 sample:', partOne(sample));
console.log('Part 1       :', partOne(input));
console.log('Part 2 sample:', partTwo(sample));
console.log('Part 2       :', partTwo(input));