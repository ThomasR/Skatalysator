/*
 * Copyright 2024 Thomas Rosenau
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const handleContinuation = ({ best }) => {

  let suitSymbol = {
    C: '\u{2663}\u{FE0F}',
    S: '\u{2660}\u{FE0F}',
    H: '\u{2665}\u{FE0F}',
    D: '\u{2666}\u{FE0F}'
  };
  let logText = best.moves.map(move => {
    let { figure } = move;
    if (figure === 'J') {
      figure = 'B';
    }
    if (figure === 'Q') {
      figure = 'D';
    }
    return `${suitSymbol[move.suit]}${figure}`;
  }).join(' ');
  let text = `Beste Fortsetzung: ${logText}`;
  let textNode = document.createTextNode(text);
  // TODO: improve display
  document.querySelector('main').appendChild(textNode);
};

const getUIElements = ({ analyzedTrickIndex, analyzedCardIndex }) => {
  let trickElement = document.querySelector(`.trick:nth-of-type(${analyzedTrickIndex + 1})`);
  let cardElement = trickElement?.querySelector(`.card:nth-of-type(${analyzedCardIndex + 1})`);
  let evalElement = cardElement?.querySelector('.evaluation');
  return {
    trickElement,
    cardElement,
    evalElement
  };
};

export const onStart = (data) => {
  let { evalElement } = getUIElements(data);
  evalElement?.classList.add('analyzing');
};

const formatScore = score => {
  if (score === -1) {
    return '0 (Schwarz)';
  } else if (score === 121) {
    return '120 (Schwarz)';
  }
  return score;
};

export const onResult = ({
  analyzedTrickIndex,
  analyzedCardIndex,
  best,
  forced,
  forfeitScore,
  isBlunder
}) => {
  let { evalElement } = getUIElements({ analyzedTrickIndex, analyzedCardIndex });

  if (!evalElement) {
    handleContinuation({ best });
    return;
  }

  evalElement.classList.remove('analyzing');
  if (forced) {
    evalElement.classList.add('forced');
    evalElement.title = 'Einzig möglicher Zug';
  } else if (best.hint === 'domination') {
    evalElement.classList.add('domination');
    evalElement.title = 'Spieler kann offenlegen';
  } else if (forfeitScore) {
    evalElement.classList.add(isBlunder ? 'blunder' : 'mistake');
    let title = `Fehler: ${formatScore(best.score)} -> ${formatScore(forfeitScore)}.`;
    title += ` Besser war: ${best.moves[0].suit}${best.moves[0].figure}`;
    evalElement.title = title;
  } else {
    evalElement.classList.add('best');
    evalElement.title = 'Bester Zug';
  }
};

export const onEnd = () => {
  [...document.querySelectorAll('.analyzing')].forEach(el => {
    el.classList.remove('analyzing');
  });
};
