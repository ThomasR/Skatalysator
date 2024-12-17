/*
 * Copyright 2024 Thomas Rosenau
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { GameType } from '../model/GameType.mjs';
import { suitLetters } from '../model/Suit.mjs';

export class GameHasher {
  static hash(game) {
    let result= `${game.currentPlayer},`;
    if (game.gameType === GameType.NULL) {
      result += this.#hashNullGame(game);
    } else {
      result += this.#hashGenericGame(game);
    }
    if (game.currentTrick?.length) {
      result += `,${game.currentTrick.cards.map(({ figure, suit }) => `${suit}${figure}`).join(',')}`;
    }
    return result;
  }

  static #hashNullGame(game) {
    return game.distribution.hands.map(hand => GameHasher.#nullHandToHash(hand)).join(',');
  }

  static #nullHandToHash(hand) {
    let result = 0;
    hand.allCards.forEach(card => {
      result += 2 ** (card.rank + 8 * (3 - card.suitIndex));
    });
    return result;
  }

  static #hashGenericGame(game) {
    let allCards = game.distribution.hands.flatMap(hand => hand.allCards);
    if (game.currentTrick?.length) {
      allCards.push(...game.currentTrick.cards);
    }
    // quasi-symmetry reduction as described in https://ai.dmi.unibas.ch/papers/kupferschmid-helmert-cg2006.pdf#page=7
    let jackFactors = this.#getJackFactors(allCards);
    let smallCardFactors = this.#getSmallCardFactors(allCards);
    return game.distribution.hands.map(hand => hand.allCards.reduce((hash, card) => {
      if (card.figure === 'J') {
        hash += 2 ** (jackFactors[card.suit] + 21);
      } else if (['7', '8', '9'].includes(card.figure)) {
        hash += 2 ** (smallCardFactors[card.suit][card.figure] + 7 * (3 - card.suitIndex));
      } else {
        hash += 2 ** (card.rank + 7 * (3 - card.suitIndex));
      }
      return hash;
    }, 0)).join(',');
  }

  static #getJackFactors(allCards) {
    let i = 7;
    return suitLetters.toReversed().reduce((result, suit) => {
      if (allCards.some(card => card.suit === suit && card.figure === 'J')) {
        result[suit] = i;
        i++;
      }
      return result;
    }, {});
  }

  static #getSmallCardFactors(allCards) {
    let getFactors = (suit) => {
      let i = 0;
      return ['7', '8', '9'].reduce((result, figure) => {
        if (allCards.some(card => card.suit === suit && card.figure === figure)) {
          result[figure] = i;
          i++;
        }
        return result;
      }, {});
    };
    return suitLetters.reduce((result, suit) => {
      result[suit] = getFactors(suit);
      return result;
    }, {});
  }
}
