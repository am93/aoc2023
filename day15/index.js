import fs from 'fs'

function ddIns(key, val, dict) {
  if(key in dict) dict[key].push(val);
  else dict[key] = [val];
  return dict;
}

function ddGet(dict, key, deflt=[]) {
  if(key in dict) return dict[key]
  return deflt;
}

function insertLens(dict, key, t){
  let box = ddGet(dict, key);
  for(let idx = 0; idx < box.length; idx++){
    if(box[idx][0] == t[0]) {
      box[idx] = t;
      dict[key] = box;
      return dict;
    }
  }
  box.push(t);
  dict[key] = box;
  return dict;
}

function removeLens(dict, key, tag){
  let box = ddGet(dict, key);
  for(let idx = 0; idx < box.length; idx++){
    if(box[idx][0] == tag) {
      box.splice(idx, 1);
      break;
    }
  }
  if(box.length > 0) dict[key] = box;
  else delete dict[key];
  return dict;
}

function HASH(label) {
  return label.split('').reduce((sum, c) => ((sum + c.charCodeAt(0)) * 17) % 256, 0);
}

function partOne(filename) {
  const sequence = fs.readFileSync(filename, 'utf-8').trim().split(',');
  let val = sequence.map((s) => HASH(s));
  return val.reduce((sum,v) => sum + v);
}

function partTwo(filename) {
  const sequence = fs.readFileSync(filename, 'utf-8').trim().split(',');
  let boxes = {}
  for(let sq of sequence) {
    if(sq.indexOf("=") > -1) {
      let t = sq.split("=");
      let boxId = HASH(t[0]);
      boxes = insertLens(boxes, boxId, t);
    }
    else if(sq.indexOf("-") > -1) {
      let t = sq.split("-");
      let boxId = HASH(t[0]);
      boxes = removeLens(boxes, boxId, t[0]);
    }
  }

  let focusing = 0;
  for(let boxId in boxes) {
    focusing += boxes[boxId].reduce((acc, l, idx) => acc + ((parseInt(boxId)+1)*(idx+1)*parseInt(l[1])), 0);
  }
  return focusing;
}

console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));