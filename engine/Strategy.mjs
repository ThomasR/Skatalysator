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

import { suitLetters } from './model/Suit.mjs';

export class Strategy {

  game;

  constructor(game) {
    this.game = game;
  }

  getBestMoveCandidates() {
    throw new Error('Abstract method cannot be called directly');
  }

  getPossibleMoves() {
    if (this.game.isOver()) {
      return [];
    }
    let hand = this.game.distribution.hands[this.game.currentPlayer];
    if (this.game.currentTrick.length > 0) {
      let firstCard = this.game.currentTrick[0];
      if (firstCard.isTrump(this.game.gameType)) {
        if (hand.trumpCards.length) {
          return hand.trumpCards;
        }
      } else if (hand.cards[firstCard.suit].length > 0) {
        return [...hand.cards[firstCard.suit]];
      }
    }
    return hand.allCards;
  }

  static getPossibleMoves(game) {
    return this.prototype.getPossibleMoves.call({ game });
  }

  getDominantStrategy() {
    let hasDominantStrategy = this.hasDominantStrategy();
    if (!hasDominantStrategy) {
      return null;
    }
    let isSoloPlayer = this.game.isCurrentPlayerSolo;
    let score = isSoloPlayer ? (120 - this.game.pointsDuo) : this.game.pointsSolo;
    if (isSoloPlayer && !this.game.duoHasMadeTrick) {
      score = 121;
    } else if (!isSoloPlayer && !this.game.soloHasMadeTrick) {
      score = -1;
    }

    return {
      score,
      hint: 'domination'
    };
  }

  hasDominantStrategy() {

    let hands = this.game.distribution.hands;
    let myHand = hands[this.game.currentPlayer];
    let otherHand1 = hands[(this.game.currentPlayer + 1) % 3];
    let otherHand2 = hands[(this.game.currentPlayer + 2) % 3];
    switch (this.game.currentTrick.length) {
    case 0:
      if (!Strategy.isDominant(myHand.trumpCards, otherHand1.trumpCards, otherHand2.trumpCards, true)) {
        return false;
      }
      for (let suit of suitLetters) {
        if (suit === this.game.gameType) {
          continue;
        }
        if (!Strategy.isDominant(myHand.cards[suit], otherHand1.cards[suit], otherHand2.cards[suit])) {
          return false;
        }
      }
      return true;
    case 1:
      // TODO
      return false;
    case 2:
      // TODO
      return false;
    default:
      return false;
    }
  }

  static isDominant(set1, set2, set3, isTrump) {
    let firstSetLength = set1.length;
    // checking what happens if we play the cards top-down
    for (let i = 0; i < firstSetLength; i++) {
      // opponents play their cards bottom-up
      if (set2.at(-i - 1)?.beatsCard(set1[i]) || set3.at(-i - 1)?.beatsCard(set1[i])) {
        return false;
      }
    }
    // No more cards left. If opponent has trumps leftover, then our hand is not dominant
    if (isTrump) {
      return set2.length <= set1.length && set3.length <= set1.length;
    }
    return true;
  }
}
