import fs from 'fs'

function doMapping(num, mapper) {
  for(let mp of mapper) {
    if(mp[0] <= num && num <= mp[1]) {
      return mp[2] + (num - mp[0]);
    }
  }
  return num;
}

function createrMapper(mapDict, data, rowIdx) {
  rowIdx++;
  while(rowIdx < data.length - 1 & data[rowIdx].length > 2) {
    let mapping = data[rowIdx].split(' ').map((x) => parseInt(x));
    mapDict.push([mapping[1], mapping[1]+mapping[2]-1, mapping[0]])
    rowIdx++;
  }
  mapDict.shift();
  return [rowIdx, mapDict];
}

function solve(filename) {
  console.log('Solving for '+filename);

  const data = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  let rowIdx = 0;
  let seeds = []
  let seed2Soil = [[]];
  let soil2Fert = [[]];
  let fert2Watr = [[]];
  let watr2Ligt = [[]];
  let ligt2temp = [[]];
  let temp2humd = [[]];
  let humd2loct = [[]];

  while(rowIdx < data.length) {
    if(data[rowIdx].startsWith("seeds:")) {
      seeds = data[rowIdx]
        .slice(data[rowIdx].indexOf(':') + 2)
        .split(' ')
        .map((s) => parseInt(s));
    }
    else if(data[rowIdx].startsWith("seed-to-soil")) {
      [rowIdx, seed2Soil] = createrMapper(seed2Soil, data, rowIdx);
    }
    else if(data[rowIdx].startsWith("soil-to-fertilizer")) {
      [rowIdx, soil2Fert] = createrMapper(soil2Fert, data, rowIdx);
    }
    else if(data[rowIdx].startsWith("fertilizer-to-water")) {
      [rowIdx, fert2Watr] = createrMapper(fert2Watr, data, rowIdx);
    }
    else if(data[rowIdx].startsWith("water-to-light")) {
      [rowIdx, watr2Ligt] = createrMapper(watr2Ligt, data, rowIdx);
    }
    else if(data[rowIdx].startsWith("light-to-temperature")) {
      [rowIdx, ligt2temp] = createrMapper(ligt2temp, data, rowIdx);
    }
    else if(data[rowIdx].startsWith("temperature-to-humidity")) {
      [rowIdx, temp2humd] = createrMapper(temp2humd, data, rowIdx);
    }
    else if(data[rowIdx].startsWith("humidity-to-location")) {
      [rowIdx, humd2loct] = createrMapper(humd2loct, data, rowIdx);
    }
    rowIdx++;
  }

  console.log('  Part1: '+Math.min.apply(null, seeds.map((s) => doMapping(doMapping(
    doMapping(doMapping(doMapping(doMapping(doMapping(s, seed2Soil), soil2Fert), fert2Watr),
    watr2Ligt), ligt2temp), temp2humd), humd2loct))));

  let seedIdx = 0;
  let minLocat = null;
  while(seedIdx < seeds.length) { 
    let seed = seeds[seedIdx];
    while(seed < seeds[seedIdx] + seeds[seedIdx+1]) {
      let crrLocat = doMapping(doMapping(doMapping(doMapping(doMapping(doMapping(doMapping(
        seed, seed2Soil), soil2Fert), fert2Watr), watr2Ligt), ligt2temp), temp2humd), humd2loct);
      if(minLocat == null || minLocat > crrLocat) {
        minLocat = crrLocat;
      }
      seed++;
    }
    seedIdx += 2;
  }

  console.log('  Part2: '+minLocat);
}

solve('./sample.txt');
solve('./input.txt');
