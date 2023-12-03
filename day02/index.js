import fs from 'fs'

const LIMITS = {'red': 12, 'green': 13, 'blue': 14}

function partOne(filename) {
  const games = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                .map((line) => line.slice(line.indexOf(':')+2))
                .map((line) => line.split('; '));
  const gameRounds = (games.map((g) => g.map((r) => r.split(', '))));
  const gameRoundsCubes = gameRounds.map((g) => g.map((r) => r.map((cbs) => cbs.split(' '))));
  const possibleGames= gameRoundsCubes.map((g) => 
        g.every((r) => 
            r.every((cbs) => {
                return LIMITS[cbs[1]] >= cbs[0];
            }
    )));
  const possibleIdxs = possibleGames.reduce((acc, game, idx) => {
    if(game) {
        acc.push(idx+1);
    }
    return acc;
  }, []);

  return possibleIdxs.reduce((sum, val) => sum + val);
}

function partTwo(filename) {
    const games = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                  .map((line) => line.slice(line.indexOf(':')+2))
                  .map((line) => line.replaceAll(', ','-').replaceAll('; ','-').split('-'));
    const minCubes= games.map((g) => {
        let colors = {'red': 0, 'green': 0, 'blue': 0};
        g.map((draw) => {
            let cube = draw.split(' ')
            if(colors[cube[1]] < Number(cube[0]))
                 colors[cube[1]] = Number(cube[0]);
            });
        return colors;
        })
        .reduce((acc, val) => acc + Number(val['red']*val['green']*val['blue']), 0);
    return minCubes;
  }


console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));