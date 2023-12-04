import fs from 'fs'

function partOne(filename) {
  const cards = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                .map((line) => line.slice(line.indexOf(':')+2))
                .map((line) => line.split(' | ').map(part => part.replaceAll('  ',' ').split(' ')));

  return cards.map((c) => {
    return c[0].reduce((acc, winNum) => {
      for(let lotNum of c[1]) {
        if(!isNaN(parseInt(winNum)) & !isNaN(parseInt(lotNum)) & Number(winNum) == Number(lotNum)) {
          if(acc == 0)
            acc = 1;
          else
            acc *= 2;
        }
      }
      return acc;
    }, 0);
  }).reduce((sum, val) => sum + val);
}

function partTwo(filename) {
  const cards = fs.readFileSync(filename, 'utf-8').trim().split('\n')
                .map((line) => line.slice(line.indexOf(':')+2))
                .map((line) => line.split(' | ').map(part => part.replaceAll('  ',' ').split(' ')));
  
  const totalCards = cards.length;
  let duplicates = Array.from({length: totalCards}, (v, i) => 1)
  let cardArr = [...Array(totalCards).keys()];

  while(cardArr.length > 0) {
    let crrIdx = cardArr.shift();
    let crrDupl = duplicates[crrIdx]
    let numWins = cards[crrIdx][0].reduce((acc, winNum) => {
      for(let lotNum of cards[crrIdx][1]) {
        if(!isNaN(parseInt(winNum)) & !isNaN(parseInt(lotNum)) & Number(winNum) == Number(lotNum)) {
          acc++;
        }
      }
      return acc;
    }, 0);
    
    for(let i = crrIdx+1; i < Math.min(crrIdx + numWins + 1, totalCards); i++)
    {
      duplicates[i] += crrDupl;
    }
  }
  return duplicates.reduce((sum, val) => sum + val);
}



console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));