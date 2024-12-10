/*
 *  Copyright 2024 Thomas Rosenau
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import sample from './sample.mjs';

import analyzeGame from '../analyzeGame.mjs';
import { onStart, onEnd, onResult } from '../analysisCallbacks.mjs';
import { updateForm } from './kartenleger.mjs';

const main = document.querySelector('main');

const addTrickMarkup = trick => {
  let trickDiv = document.createElement('div');
  trickDiv.className = 'trick';
  trickDiv.dataset.leader = trick.leadPlayer + 1;
  trickDiv.dataset.winner = trick.winningPlayer + 1;
  main.appendChild(trickDiv);
  return trickDiv;
};

const suitNames = {
  C: 'clubs',
  S: 'spades',
  H: 'hearts',
  D: 'diamonds'
};

let leadPlayer = sample.playedTricks[0]?.leadPlayer ?? sample.currentTrick.leadPlayer ?? sample.currentPlayer;

const addGameInfo = game => {
  let info = document.createElement('div');
  info.className = 'info';
  let leadPlayer = game.playedTricks[0]?.leadPlayer || game.currentTrick?.leadPlayer || game.currentPlayer;
  let player = ['VH (A)', 'MH (B)', 'HH (C)'].at(game.soloPlayer - leadPlayer);
  let suitSymbol = {
    C: '\u{2663}\u{FE0F}',
    S: '\u{2660}\u{FE0F}',
    H: '\u{2665}\u{FE0F}',
    D: '\u{2666}\u{FE0F}',
    '-1': '',
    null: ''
  };
  let suitTitle = {
    C: ' Kreuz',
    S: ' Pik',
    H: ' Herz',
    D: ' Karo',
    '-1': 'Grand',
    null: 'Null'
  };
  let skatText = game.distribution.skat.map(({ suit, figure }) => {
    let result = suitSymbol[suit];
    return `${result}${figure}`;
  }).join(' ');
  info.textContent = `${player} spielt ${suitSymbol[game.gameType]}${suitTitle[game.gameType]}. Gedrückt: ${skatText}`;
  document.body.appendChild(info);
};

const addCards = (trick, trickNode) => {
  trick.cards.forEach(({ suit, figure }, index) => {
    const cardImg = document.createElement('img');
    if (figure === 'J') {
      figure = 'B';
    } else if (figure === 'Q') {
      figure = 'D';
    }

    cardImg.src = `../../svg-cardio/svgs/tekeye/${suitNames[suit]}-${figure}.svg`;
    const wrapper = document.createElement('div');
    wrapper.classList.add('card');
    let playerIndex = (trick.leadPlayer + index) % 3;
    if (trick.winningPlayer === playerIndex) {
      wrapper.classList.add('trick-winner');
    }
    wrapper.dataset.playerIndex = playerIndex + 1;
    wrapper.dataset.playerId = ['A', 'B', 'C'].at(playerIndex - leadPlayer);
    wrapper.appendChild(cardImg);
    let evaluation = document.createElement('div');
    evaluation.className = 'evaluation';
    wrapper.appendChild(evaluation);
    trickNode.appendChild(wrapper);
  });
};

const addScore = (trickIndex, trickDiv) => {
  let scoreEl = document.createElement('span');
  scoreEl.className = 'score';
  let soloScore = sample.distribution.skat.reduce((a, b) => a + b.value, 0);
  let duoScore = 0;
  for (let i = 0; i <= trickIndex; i++) {
    let trick = sample.playedTricks[i];
    if (!trick) {
      return;
    }
    if (trick.winningPlayer === sample.soloPlayer) {
      soloScore += trick.value;
    } else if (typeof trick.winningPlayer === 'number') {
      duoScore += trick.value;
    }
  }
  scoreEl.textContent = `${soloScore}:${duoScore}`;
  scoreEl.title = `Alleinspieler: ${soloScore} Augen, Gegenspieler: ${duoScore} Augen`;
  trickDiv.appendChild(scoreEl);
};

updateForm(sample);
addGameInfo(sample);

let tricks = [...sample.playedTricks];
if (sample.currentTrick?.length) {
  tricks.push(sample.currentTrick);
}

tricks.forEach((trick, i) => {
  let trickDiv = addTrickMarkup(trick);
  addCards(trick, trickDiv);
  addScore(i, trickDiv);
});


let btn = document.querySelector('#analysis-button');
let stop = null;
btn.addEventListener('click', () => {
  if (!stop) {
    let timeout = Number(document.querySelector('#timeout').value);
    stop = analyzeGame({
      game: sample,
      onResult,
      onStart,
      onEnd,
      timeout
    });
    btn.textContent = 'Analyse stoppen';
  } else {
    stop();
    stop = null;
    btn.textContent = 'Analyse starten';
  }
});
