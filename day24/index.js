import fs from 'fs'
import { init } from 'z3-solver';

function partOne(lines, MINXY, MAXXY) {
  let pos = [];
  let vel = [];
  for (let line of lines) {
    let parts = line.split(" @ ");
    pos.push(parts[0].split(", ").map(Number));
    vel.push(parts[1].split(", ").map(Number));
  }
  
  let total = 0;
  for (let j = 0; j < pos.length; j++) {
    let p1 = pos[j];
    let v1 = vel[j];
    for (let i = 0; i < j; i++) {
      let p0 = pos[i];
      let v0 = vel[i];
      if (v0[1] * v1[0] !== v0[0] * v1[1]) {
        let x = ((p1[1] - p0[1]) + p0[0] * (v0[1] / v0[0]) - p1[0] * (v1[1] / v1[0])) / ((v0[1] / v0[0]) - (v1[1] / v1[0]));
        let t0 = (x - p0[0])/ v0[0];
        if (t0 >= 0) {
          let t1 = (x - p1[0])/ v1[0];
          if (t1 >= 0) {
            let y = p0[1] + t0 * v0[1];
            let coll = [x, y];
            if (coll[0] >= MINXY && coll[0] <= MAXXY && coll[1] >= MINXY && coll[1] <= MAXXY) {
              total++;
            }
          }
        }
      }
    }
  }
  console.log('  ',total);
}

async function partTwo(lines) {
  let pos = [];
  let vel = [];
  for (let line of lines) {
      line = line.trim();
      let [p, v] = line.split(" @ ");
      pos.push(p.split(", ").map(Number));
      vel.push(v.split(", ").map(Number));
  }

  const { Context } = await init();
  const { Solver, Int} = new Context('main');
  const x = Int.const('x');
  const y = Int.const('y');
  const z = Int.const('z');
  const vx = Int.const('vx');
  const vy = Int.const('vy');
  const vz = Int.const('vz');
  const solver = new Solver();

  for (let i = 0; i < pos.length; i++) {
      let [x_i, y_i, z_i] = pos[i];
      let [vx_i, vy_i, vz_i] = vel[i];
      let t_i = Int.const(`t_${i}`);

      solver.add(t_i.mul(vx_i).add(x_i).sub(x).sub(t_i.mul(vx)).eq(0));
      solver.add(t_i.mul(vy_i).add(y_i).sub(y).sub(t_i.mul(vy)).eq(0));
      solver.add(t_i.mul(vz_i).add(z_i).sub(z).sub(t_i.mul(vz)).eq(0));

      if(i > 3) break;
  }
  await solver.check();
  console.log('  ', Number(solver.model().eval(x.add(y).add(z)).value()));
}

const sample = fs.readFileSync('sample.txt', 'utf8').split('\n');
const input = fs.readFileSync('input.txt', 'utf8').split('\n');
console.log('Sample: ');
partOne(sample, 7, 27);
console.log('Input: ');
partOne(input, 200000000000000, 400000000000000);
partTwo(input).catch(console.error);
