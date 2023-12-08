import fs from 'fs'

const CARDS  = ".23456789TJQKA";
const CARDS2 = ".J23456789TQKA";

function partOne(filename) {
  const hands = fs.readFileSync(filename, 'utf-8').trim().split('\n')
    .map((line) => line.split(' '));
  
  let mappedHands = hands.map((hand) => {
    let handCards = {}
    let handScore = 0;
    hand[0].split('').forEach((card) => {
      card in handCards ? handCards[card] += 1 : handCards[card] = 1;
      });

    if(Object.values(handCards).indexOf(5) > -1) {
      handScore += 6000000;
    } else if(Object.values(handCards).indexOf(4) > -1) {
      handScore += 5000000;
    } else if (Object.values(handCards).indexOf(3) > -1 && Object.values(handCards).indexOf(2) > -1) {
      handScore += 4000000;
    } else if (Object.values(handCards).indexOf(3) > -1) {
      handScore += 3000000;
    } else if (Object.values(handCards).indexOf(2) > -1 && 
              Object.values(handCards).indexOf(2) != Object.values(handCards).lastIndexOf(2)) {
      handScore += 2000000;
    } else if (Object.values(handCards).indexOf(2) > -1) {
      handScore += 1000000;
    } else {
      handScore += 0;
    }
    handScore += hand[0].split('').reverse().map((c, i) => CARDS.indexOf(c) * Math.pow(13, i)).reduce((sum, v) => sum + v);
    return [handScore, parseInt(hand[1])];
  });
  return mappedHands.sort((a, b) => a[0] - b[0]).map((h, i) => [i+1, h[1]]).reduce((sum, v) => sum + (v[0]*v[1]), 0);
}

function partTwo(filename) {
  const hands = fs.readFileSync(filename, 'utf-8').trim().split('\n')
    .map((line) => line.split(' '));
  
  let mappedHands = hands.map((hand) => {
    let handCards = {}
    let handScore = 0;
    let tempHand = hand[0].replaceAll('J', '')
    tempHand.split('').forEach((card) => {
      card in handCards ? handCards[card] += 1 : handCards[card] = 1;
      });

    if(Object.values(handCards).indexOf(5) > -1 ) { //A
      handScore += 6000000;
    } else if(Object.values(handCards).indexOf(4) > -1) { //B
      if(tempHand.length == 4)
        handScore += 6000000; 
      else
        handScore += 5000000;
    } else if (Object.values(handCards).indexOf(3) > -1 && Object.values(handCards).indexOf(2) > -1) { // C
      handScore += 4000000;
    } else if (Object.values(handCards).indexOf(3) > -1) { // D
      if(tempHand.length == 3) {
        handScore += 6000000;
      }
      else if(tempHand.length == 4) {
        handScore += 5000000;
      }
      else {
        handScore += 3000000;
      }
    } else if (Object.values(handCards).indexOf(2) > -1 && 
              Object.values(handCards).indexOf(2) != Object.values(handCards).lastIndexOf(2)) { // E
      if(tempHand.length == 4) {
        handScore += 4000000;
      }
      else {
        handScore += 2000000;
      }
    } else if (Object.values(handCards).indexOf(2) > -1) { // F
      if(tempHand.length == 2) {
        handScore += 6000000;
      }
      else if(tempHand.length == 3) {
        handScore += 5000000;
      }
      else if(tempHand.length == 4) {
        handScore += 3000000;
      }
      else {
        handScore += 1000000;
      }
    } else {
      if(tempHand.length <= 1) {
        handScore += 6000000;
      }
      else if(tempHand.length == 2) {
        handScore += 5000000;
      }
      else if(tempHand.length == 3) {
        handScore += 3000000;
      }
      else if(tempHand.length == 4) {
        handScore += 1000000;
      }
    }
    handScore += hand[0].split('').reverse().map((c, i) => CARDS2.indexOf(c) * Math.pow(13, i)).reduce((sum, v) => sum + v);
    return [handScore, parseInt(hand[1])];
  });
  return mappedHands.sort((a, b) => a[0] - b[0]).map((h, i) => [i+1, h[1]]).reduce((sum, v) => sum + (v[0]*v[1]), 0);
}

console.log('Part 1 sample:', partOne('./sample.txt'));
console.log('Part 1       :', partOne('./input.txt'));
console.log('Part 2 sample:', partTwo('./sample.txt'));
console.log('Part 2       :', partTwo('./input.txt'));