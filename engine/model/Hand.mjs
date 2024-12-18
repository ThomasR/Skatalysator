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

import { Card } from './Card.mjs';
import { GameType } from './GameType.mjs';

const suits = ['J', 'C', 'S', 'H', 'D'];

export class Hand {
  cards = Object.fromEntries(suits.map(suit => [suit, []]));

  gameType = null;

  constructor(input, gameType) {

    this.gameType = gameType;

    if (typeof gameType === 'undefined') {
      throw new Error('Must pass gameType');
    }

    if (input instanceof Hand) {
      for (let suit of suits) {
        this.cards[suit] = [...input.cards[suit]];
      }
      return;
    }

    if (!Array.isArray(input)) {
      input = Object.values(input).flat();
    }

    let isNull = this.gameType === GameType.NULL;
    input.forEach(cardInput => {
      let card = new (Card(this.gameType))(cardInput);
      let suitIndex = (card.figure === 'J' && !isNull) ? 'J' : card.suit;
      this.cards[suitIndex].push(card);
    });
    this.#sortCards();
  }

  #sortCards() {
    for (let suit of suits) {
      this.cards[suit].sort((a, b) => b.rank - a.rank);
    }
  }

  get trumpCards() {
    if (this.gameType === GameType.GRAND) {
      return [...this.cards.J];
    } else if (this.gameType !== GameType.NULL) {
      return [...this.cards.J, ...this.cards[this.gameType]];
    } else {
      return [];
    }
  }

  get allCards() {
    return Object.values(this.cards).flat();
  }

  get hasTrumps() {
    return this.trumpCards.length > 0;
  }

  addCard(newCard) {
    let suit = (newCard.figure === 'J' && this.gameType !== null) ? 'J' : newCard.suit;
    let insertionIndex = 0;
    for (let card of this.cards[suit]) {
      if (card.rank < newCard.rank) {
        break;
      }
      insertionIndex++;
    }
    if (this.cards[suit][insertionIndex - 1] === newCard) {
      throw new Error(`Player already has ${newCard}!`);
    }
    this.cards[suit].splice(insertionIndex, 0, newCard);
  }

  removeCard(card) {
    let suit = (card.figure === 'J' && this.gameType !== GameType.NULL) ? 'J' : card.suit;
    let index = this.cards[suit].indexOf(card);
    if (index > -1) {
      this.cards[suit].splice(index, 1);
    } else {
      throw new Error(`Player does not have ${card}!`);
    }
  }

  toString() {
    let suits = ['J'];
    if (this.gameType !== GameType.GRAND && this.gameType !== GameType.NULL) {
      suits.push(this.gameType);
    }
    ['C', 'S', 'H', 'D'].forEach(suit => {
      if (suit !== this.gameType) {
        suits.push(suit);
      }
    });
    let cards = suits.map(suit => this.cards[suit]);
    return cards.flat(2).join(' ') || '-';
  }

  clone() {
    return new Hand(this, this.gameType);
  }
}
