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

function moveNorth(maxRow, maxCol, rocks, blkByC, blkByR) {
	let rckByC = {}
	for(let rck of rocks) {
		let blk = ddGet(blkByC, rck[1]).filter((blk) => blk[0] < rck[0]).pop();
		let col = ddGet(rckByC, rck[1], []);
		let newIdx = Math.max(blk == null ? -1 : blk[0], ...col) + 1;
		col.push(newIdx);
		rckByC[rck[1]] = col;
	}
	let newRocks = []
	for(let c in rckByC) {
		newRocks = newRocks.concat(rckByC[c].map((r) => [r, parseInt(c)]));
	}
	return newRocks;
}

function moveWest(maxRow, maxCol, rocks, blkByC, blkByR) {
	let rckByR = {}
	for(let rck of rocks) {
		let blk = ddGet(blkByR, rck[0]).filter((blk) => blk[1] < rck[1]).pop();
		let row = ddGet(rckByR, rck[0], []);
		let newIdx = Math.max(blk == null ? -1 : blk[1], ...row) + 1;
		row.push(newIdx);
		rckByR[rck[0]] = row;
	}
	let newRocks = []
	for(let r in rckByR) {
		newRocks = newRocks.concat(rckByR[r].map((c) => [parseInt(r), parseInt(c)]));
	}
	return newRocks;
}

function moveSouth(maxRow, maxCol, rocks, blkByC, blkByR) {
	let rckByC = {}
	for(let rck of rocks.reverse()) {
		let blk = ddGet(blkByC, rck[1]).filter((blk) => blk[0] > rck[0]).shift();
		let col = ddGet(rckByC, rck[1], []);
		let newIdx = Math.min(blk == null ? maxRow : blk[0], ...col) - 1;
		col.push(newIdx);
		rckByC[rck[1]] = col;
	}
	let newRocks = []
	for(let c in rckByC) {
		newRocks = newRocks.concat(rckByC[c].reverse().map((r) => [r, parseInt(c)]));
	}
	return newRocks;
}

function moveEast(maxRow, maxCol, rocks, blkByC, blkByR) {
	let rckByR = {}
	for(let rck of rocks.reverse()) {
		let blk = ddGet(blkByR, rck[0]).filter((blk) => blk[1] > rck[1]).shift();
		let row = ddGet(rckByR, rck[0], []);
		let newIdx = Math.min(blk == null ? maxCol : blk[1], ...row) - 1;
		row.push(newIdx);
		rckByR[rck[0]] = row;
	}
	let newRocks = []
	for(let r in rckByR) {
		newRocks = newRocks.concat(rckByR[r].reverse().map((c) => [parseInt(r), parseInt(c)]));
	}
	return newRocks;
}

function solve(filename) {
	const dish = fs.readFileSync(filename, 'utf-8').trim().split('\n');
	let maxRow = dish.length;
	let maxCol = dish[0].length;
	let rocks = []
	let blkByC = {}
	let blkByR = {}
	
	for(let rowIdx = 0; rowIdx < maxRow; rowIdx++) {
		for(let colIdx = 0; colIdx < maxCol; colIdx++) {
			if(dish[rowIdx][colIdx] == 'O'){
				rocks.push([rowIdx,colIdx]);
			}
			else if(dish[rowIdx][colIdx] == '#'){
				blkByC = ddIns(colIdx, [rowIdx, colIdx], blkByC);
				blkByR = ddIns(rowIdx, [rowIdx, colIdx], blkByR);
			}
		}
	}
	// ------- Part 1
	//console.time(' P1:');
	let newRocks = moveNorth(maxRow, maxCol, rocks, blkByC, blkByR);
	let load = 0;
	for(let r of newRocks) {
		load += maxRow - r[0];
	}
	console.log('  Part1: '+load);
	//console.timeEnd(' P1:');

	// ------- Part 2
	let cycRocks = rocks.slice();
	let memory = {};
	let state = null;
	let cyclesLeft = 0;
	let idx = 0;
	let totalCycles = 1000000000;
	while(true) {
		idx++;
		cycRocks = moveNorth(maxRow, maxCol, cycRocks, blkByC, blkByR);
		cycRocks = moveWest(maxRow, maxCol, cycRocks, blkByC, blkByR);
		cycRocks = moveSouth(maxRow, maxCol, cycRocks, blkByC, blkByR);
		cycRocks = moveEast(maxRow, maxCol, cycRocks, blkByC, blkByR);
		state = cycRocks.toString();
		if(state in memory) {
			let diff = idx - memory[state];
			cyclesLeft = (totalCycles - idx) % diff - 1;
			break;
		}
		memory[state] = idx;
	}

	while(cyclesLeft >= 0) {
		cyclesLeft--;
		cycRocks = moveNorth(maxRow, maxCol, cycRocks, blkByC, blkByR);
		cycRocks = moveWest(maxRow, maxCol, cycRocks, blkByC, blkByR);
		cycRocks = moveSouth(maxRow, maxCol, cycRocks, blkByC, blkByR);
		cycRocks = moveEast(maxRow, maxCol, cycRocks, blkByC, blkByR);
	}

	let load2 = 0;
	for(let r of cycRocks) {
		load2 += maxRow - r[0];
	}
	console.log('  Part2: '+load2);
}

console.log('Sample: ');
solve('./sample.txt')
console.log('Input: ');
solve('./input.txt')
