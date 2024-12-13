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

import { Card } from './Card.mjs';

export class Trick {
  cards;
  leadPlayer;
  winningPlayer;

  constructor({
    cards = [],
    leadPlayer = 0,
    winningPlayer = null,
    gameType
  } = {}) {
    this.cards = cards.map(cardInput => new (Card(gameType))(cardInput));
    this.leadPlayer = leadPlayer;
    this.winningPlayer = winningPlayer;
  }

  playCard(card) {
    if (this.cards.length === 3) {
      throw new Error('Too many cards!');
    }
    this.cards.push(card);
  }

  resolve(gameType) {
    let winningPlayer = this.#getTrickWinner(gameType);
    this.winningPlayer = winningPlayer;
    let score = this.value;
    return {
      winningPlayer,
      score
    };
  }

  get length() {
    return this.cards.length;
  }

  get '0'() {
    return this.cards[0];
  }

  get '1'() {
    return this.cards[1];
  }

  get '2'() {
    return this.cards[2];
  }


  get value() {
    return this.cards.reduce((a, b) => a + b.value, 0);
  }

  #getTrickWinner(gameType) {
    let winning = this.cards.reduce((best, challenger) => {
      if (challenger.beatsCard(best, gameType)) {
        return challenger;
      }
      return best;
    });
    return (this.leadPlayer + this.cards.indexOf(winning)) % 3;
  }

  clone() {
    return new Trick(this);
  }

  toString() {
    return this.cards.join(' ');
  }
}
