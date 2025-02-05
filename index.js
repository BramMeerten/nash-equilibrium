function runGame(p1Num, p2Num, p3Num) {
  const numbers = [
    { player: 0, number: p1Num },
    { player: 1, number: p2Num },
    { player: 2, number: p3Num },
  ];

  if (p1Num === p2Num && p2Num === p3Num) {
    return Math.floor(Math.random() * 3);
  }

  const min = Math.min(...[p1Num, p2Num, p3Num]);
  const countMin = numbers.filter(num => num.number === min);
  if (countMin.length === 1) {
    return countMin[0].player;
  }

  for (const number of numbers) {
    if (numbers.filter(num => num.number === number.number).length === 1) {
      return number.player;
    }
  }

  throw Error("Should never happen");
}

function emulateGame(p1Strategy, p2Strategy, p3Strategy) {
  const p1 = p1Strategy();
  const p2 = p2Strategy();
  const p3 = p3Strategy();
  const winner = runGame(p1, p2, p3);

  return {
    log: `P1 picked ${p1}, P2 picked ${p2}, P3 picked ${p3}. Winning player: ${winner + 1}`,
    winner
  }
}

const strategyPickOneTwoOrThree = () => Math.floor(Math.random() * 3) + 1;
const alwaysOne = () => 1;
const alwaysTwo = () => 2;
const always99 = () => 99;
const nash = () => {
  let n = 1;
  while (Math.random() > 0.5) {
    n++;
  }
  return n;
};

const STRATEGIES = {
  oneTwoThree: strategyPickOneTwoOrThree,
  alwaysOne: alwaysOne,
  alwaysTwo: alwaysTwo,
  always99: always99,
  nash: nash,
}

function updateResults(rounds, p1, p2, p3, log) {
  const roundsElem = document.querySelector("#simulation #rounds");
  const p1Wins = document.querySelector("#simulation #p1");
  const p2Wins = document.querySelector("#simulation #p2");
  const p3Wins = document.querySelector("#simulation #p3");
  const logs = document.querySelector("#simulation #logs");

  roundsElem.textContent = 'Rounds: ' + String(rounds).padStart(5, '0');
  p1Wins.textContent = 'p1 ' + (p1 * 100).toFixed(2).padStart(5, '0') + '%';
  p2Wins.textContent = 'p2 ' + (p2 * 100).toFixed(2).padStart(5, '0') + '%';
  p3Wins.textContent = 'p3 ' + (p3 * 100).toFixed(2).padStart(5, '0') + '%';

  const div = document.createElement('div');
  div.innerText = log;
  logs.prepend(div);
}

let round;
let speed = 1;
function startSimulation() {
  const p1Strat = document.querySelector(`input[name="p1"]:checked`).value;
  const p2Strat = document.querySelector(`input[name="p2"]:checked`).value;
  const p3Strat = document.querySelector(`input[name="p3"]:checked`).value;

  const container = document.getElementById("simulation");
  const logs = document.querySelector("#simulation #logs");
  document.querySelector('button').innerText = 'Stop simulation';
  container.style.display = 'block';
  logs.innerHTML = null;

  round = { n: 0, wins: [0, 0, 0], interval: undefined};

  const sim = () => {
    const result = emulateGame(STRATEGIES[p1Strat], STRATEGIES[p2Strat], STRATEGIES[p3Strat]);
    round.wins[result.winner]++;
    round = { ...round, n: round.n+1 }
    updateResults(
      round.n, 
      round.wins[0] / round.n, 
      round.wins[1] / round.n, 
      round.wins[2] / round.n, 
      `Round ${round.n}: ${result.log}`);
  };

  const interval = setInterval(() => {
    for (let i=0; i<speed; i++) sim();
  }, 100);

  round = {...round, interval: interval};
  updateSpeed();
  sim();
}

function stopSimulation() {
  if (round && round.interval !== undefined) {
    clearInterval(round.interval);
  }
  round = undefined;
  document.querySelector('button').innerText = 'Start simulation';
}

function updateSpeed() {
  speed = document.querySelector(`input[name="speed"]:checked`).value;
}
