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
import { Hand } from './Hand.mjs';

export class CardDistribution {

  hands = [];
  skat = [];
  gameType;

  constructor(input, gameType) {
    if (input instanceof CardDistribution) {
      this.#copyExistingDistribution(input);
    } else {
      if (typeof gameType === 'undefined') {
        throw new Error('gameType is required');
      }
      this.gameType = gameType;
      this.hands = CardDistribution.#initializeHands(input.hands, gameType);
      this.skat = input.skat.map(cardInput => new (Card(gameType))(cardInput));
      this.#sortSkat();
    }
  }

  #copyExistingDistribution(input) {
    this.hands = input.hands.map(hand => hand.clone());
    this.skat = [...input.skat];
    this.gameType = input.gameType;
  }

  static #initializeHands(handInputs, gameType) {
    return handInputs.map(handInput => new Hand(CardDistribution.#mapCardToHandInput(handInput), gameType));
  }

  static #mapCardToHandInput(handInput) {
    return Object.hasOwn(handInput, 'cards')
      ? Object.values(handInput.cards).flat()
      : handInput;
  }

  #sortSkat() {
    this.skat.sort((card1, card2) => {
      if (card1.suit === card2.suit || (card1.isTrump(this.gameType) && card2.isTrump(this.gameType))) {
        return card2.rank - card1.rank;
      }
      if (card1.isTrump(this.gameType)) {
        return -1;
      }
      if (card2.isTrump(this.gameType)) {
        return 1;
      }
      return card2.suitIndex - card1.suitIndex;
    });
  }

  clone() {
    return new CardDistribution(this);
  }

  addCard(card, playerIndex) {
    let hand = this.hands[playerIndex];
    try {
      hand.addCard(card);
    } catch (e) {
      throw new Error(`Player ${playerIndex + 1} already has card ${card}!\nLook: ${hand}`);
    }
  }

  removeCard(card, playerIndex) {
    let hand = this.hands[playerIndex];
    try {
      hand.removeCard(card);
    } catch (e) {
      throw new Error(`Player ${playerIndex + 1} does not have ${card}!\nLook: ${hand}`);
    }
  }

  toHash() {
    return this.hands.map(hand => hand.toHash()).join(',');
  }

  toString() {
    let playerCards = [0, 1, 2].map(i => `Pl.${i + 1}: ${this.hands[i]}`).join('\n');
    let skat = `Skat: ${this.skat.join(' ')}`;
    return `${playerCards}\n${skat}`;
  }

}
