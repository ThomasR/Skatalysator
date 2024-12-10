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
import { TrickAnalyzer } from './analysis/TrickAnalyzer.mjs';

export class Strategy {
  static getBestMoveCandidates() {
    throw new Error('Abstract method cannot be called directly');
  }

  static getPossibleMoves(game) {
    if (game.isOver()) {
      return [];
    }
    let hand = game.distribution.hands[game.currentPlayer];
    if (game.currentTrick.length > 0) {
      let firstCard = game.currentTrick[0];
      if (firstCard.isTrump(game.gameType)) {
        if (hand.trumpCards.length) {
          return hand.trumpCards;
        }
      } else if (hand.cards[firstCard.suit].length > 0) {
        return [...hand.cards[firstCard.suit]];
      }
    }

    return hand.allCards;
  }

  static #gapExistsBetween(cardA, cardB, game) {
    let currentSuitIsTrump = cardA.isTrump(game.gameType);
    let targetSuit = currentSuitIsTrump ? game.gameType : cardA.suit;
    let currentPlayer = game.currentPlayer;
    for (let card of game.currentTrick.cards) {
      if (!currentSuitIsTrump && card.isTrump(game.gameType)) {
        continue;
      }
      if (currentSuitIsTrump && !card.isTrump(game.gameType)) {
        continue;
      }
      if (cardA.rank > card.rank && card.rank > cardB.rank) {
        return true;
      }
    }
    for (let hand of game.distribution.hands) {
      if (hand === game.distribution.hands[currentPlayer]) {
        continue;
      }
      for (let index = cardB.rank + 1; index < cardA.rank; index++) {
        let searchSuit = (index > 6) ? 'J' : targetSuit;
        if (hand.cards[searchSuit].some(card => card.rank === index)) {
          return true;
        }
      }
    }
    return false;
  }

  static #findSequences(cards, game) {
    let result = [];
    let currentRun = [cards[0]];
    for (let i = 1; i < cards.length; i++) {
      let nextCard = cards[i];
      if (this.#gapExistsBetween(currentRun.at(-1), nextCard, game)) {
        result.push(currentRun);
        currentRun = [nextCard];
      } else {
        currentRun.push(nextCard);
      }
    }
    result.push(currentRun);
    return result;
  }

  static #findSequenceEnds(cards, game) {
    let sequences = cards.map(suit => this.#findSequences(suit, game)).flat();
    sequences.forEach(sequence => sequence.sort(({ value: val1 }, { value: val2 }) => val2 - val1));
    return sequences.map(sequence => {
      if (sequence[0].value === sequence.at(-1).value) {
        return [sequence[0]];
      }
      return [sequence[0], sequence.at(-1)];
    });
  }

  static #removeUnreasonableMoves(result, game) {
    result.forEach(run => {
      if (run.length === 1) {
        return;
      }
      let [high, low] = run;
      if (TrickAnalyzer.mustWinTrick(low, game)) {
        run.splice(1, 1);
      } else if (TrickAnalyzer.cannotWinTrick(high, game)) {
        run.splice(0, 1);
      }
    });
  }

  static getDominantStrategy(game) {
    let hasDominantStrategy = this.hasDominantStrategy(game);
    if (!hasDominantStrategy) {
      return null;
    }
    let isSoloPlayer = game.isCurrentPlayerSolo;
    let score = isSoloPlayer ? (120 - game.pointsDuo) : game.pointsSolo;
    if (isSoloPlayer && !game.duoHasMadeTrick) {
      score = 121;
    } else if (!isSoloPlayer && !game.soloHasMadeTrick) {
      score = -1;
    }

    return {
      score,
      hint: 'domination'
    };
  }

  static hasDominantStrategy(game) {

    let hands = game.distribution.hands;
    let myHand = hands[game.currentPlayer];
    let otherHand1 = hands[(game.currentPlayer + 1) % 3];
    let otherHand2 = hands[(game.currentPlayer + 2) % 3];
    let myTrumps;
    switch (game.currentTrick.length) {
    case 0:
      if (game.gameType) {
        myTrumps = [...myHand.cards.J, ...(myHand.cards[game.gameType] ?? [])];
        let otherTrumps1 = [...otherHand1.cards.J, ...(otherHand1.cards[game.gameType] ?? [])];
        let otherTrumps2 = [...otherHand2.cards.J, ...(otherHand2.cards[game.gameType] ?? [])];
        if (!this.isDominant(myTrumps, otherTrumps1, otherTrumps2, true)) {
          return false;
        }
      }
      for (let suit of suitLetters) {
        if (suit === game.gameType) {
          continue;
        }
        if (!this.isDominant(myHand.cards[suit], otherHand1.cards[suit], otherHand2.cards[suit])) {
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
