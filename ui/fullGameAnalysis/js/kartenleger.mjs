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

import { CardDistribution } from '../../../engine/model/CardDistribution.mjs';

const serializePhp = data => {
  if (typeof data === 'number') {
    return `i:${data};`;
  } else if (typeof data === 'string') {
    return `s:${data.length}:"${data}";`;
  } else if (typeof data === 'boolean') {
    return `b:${data ? 1 : 0};`;
  } else if (Array.isArray(data)) {
    const serializedItems = data
      .map((value, index) => serializePhp(index) + serializePhp(value))
      .join('');
    return `a:${data.length}:{${serializedItems}}`;
  } else if (typeof data === 'object') {
    const keys = Object.keys(data);
    const serializedItems = keys
      .map((key) => serializePhp(key) + serializePhp(data[key]))
      .join('');
    return `a:${keys.length}:{${serializedItems}}`;
  } else {
    return 'N;'; // Null representation
  }
};

CardDistribution.prototype.toFox = function (leadPlayer) {

  let cardToFox = card => {
    let suit = {
      C: 'kr',
      S: 'pi',
      H: 'he',
      D: 'ka'
    }[card.suit];
    let val = {
      7: '07',
      8: '08',
      9: '09',
      10: '10',
      J: 'bu',
      Q: 'da',
      K: 'ko',
      A: 'as'
    }[card.figure];
    return `${suit}${val}`;
  };

  let hands = this.hands.map(hand => Object.values(hand.cards).flat().map(cardToFox));
  let skat = this.skat.map(cardToFox);
  let json = {
    vh: hands.at(leadPlayer),
    mh: hands.at((leadPlayer + 1) % 3),
    hh: hands.at((leadPlayer + 2) % 3),
    skat
  };

  return serializePhp(json);
};


export const updateForm = () => {

  let game = Alpine.store('game').getGame().clone();
  while (true) {
    try {
      game.undoLastMove();
    } catch {
      break;
    }
  }

  document.querySelector('[name="karten"]').value = game.distribution.toFox(game.currentPlayer);
  document.querySelector('[name="spieler"]').value = ['vh', 'mh', 'hh'][(3 + game.soloPlayer - game.currentPlayer) % 3];
  document.querySelector('[name="spiel"]').value = {
    C: 'kreuz',
    S: 'pik',
    H: 'herz',
    D: 'karo',
    '-1': 'grand'
  }[game.gameType] || 'null';
};
