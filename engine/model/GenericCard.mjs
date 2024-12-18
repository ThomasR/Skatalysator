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

import { PrettyLogging } from '../PrettyLogging.mjs';
import { suitLetters, suitToSymbol } from './Suit.mjs';
import { GameType } from './GameType.mjs';

const figures = ['7', '8', '9', 'Q', 'K', '10', 'A', 'J'];
const values = [0, 0, 0, 3, 4, 10, 11, 2, 2, 2, 2];

export class GenericCard extends PrettyLogging {
  static _deck;

  suit;
  figure;

  static {
    this._initDeck();
  }

  static #parseArgs(args) {
    if (typeof args === 'string') {
      let suit = args[0];
      let figure = args.substring(1);
      if (!suitLetters.includes(suit) || !figures.includes(figure)) {
        throw new Error(`Invalid card "${args}"`);
      }
      return {
        suit,
        figure
      };
    }
    return args;
  }

  constructor(args) {
    super();
    const {
      suit, // 'D', 'H', 'S', 'C'
      figure // '7', '8', '9', 'Q', 'K', '10', 'A', 'J'
    } = GenericCard.#parseArgs(args);
    const CardOrSubclass = this.constructor;
    if (Object.hasOwn(CardOrSubclass, '_deck') && CardOrSubclass._deck) {
      try {
        return CardOrSubclass._deck[suitLetters.indexOf(suit)][figures.indexOf(figure)];
      } catch {
        throw new Error(`Invalid card ${suit}${figure}, ${args}`);
      }
    }
    this.suit = suit;
    this.figure = figure;
  }

  static _initDeck() {
    this._deck = suitLetters.map(suit => figures.map(figure => new this({
      suit,
      figure
    })));
  }


  get value() {
    return values[this.rank];
  }

  get rank() {
    if (this.figure === 'J') {
      return 10 - this.suitIndex;
    }
    return figures.indexOf(this.figure);
  }

  get suitIndex() {
    return suitLetters.indexOf(this.suit);
  }

  isTrump(gameType) {
    if (gameType === GameType.NULL) {
      return false;
    }
    return this.suit === gameType || this.figure === 'J';
  }

  beatsCard(otherCard, gameType) {
    if (otherCard.isTrump(gameType)) {
      return this.isTrump(gameType) && this.rank > otherCard.rank;
    }
    if (this.isTrump(gameType)) {
      return true;
    }
    return this.suit === otherCard.suit && this.rank > otherCard.rank;
  }

  toString() {
    return `${suitToSymbol(this.suit)}${this.figure}`;
  }

}
