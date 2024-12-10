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

import { Strategy } from '../Strategy.mjs';

export class TrickAnalyzer {

  static mustWinTrick(card, game) {
    let { gameType, currentTrick } = game;
    switch (currentTrick.length) {
    case 0: {
      let suitToCheck = card.isTrump(gameType) ? gameType : card.suit;
      for (let i of [1, 2]) {
        let opponentCards = game.distribution.hands[(game.currentPlayer + i) % 3].cards;
        let highCard = opponentCards[suitToCheck][0];
        if (highCard && highCard.beatsCard(card, gameType)) {
          return false;
        } else if (suitToCheck === gameType && opponentCards.J[0]?.beatsCard(card, gameType)) {
          return false;
        }
      }
      return true;
    }
    case 1: {
      if (!card.beatsCard(currentTrick[0], gameType)) {
        return false;
      }
      let lastPlayerCards = game.distribution.hands[(game.currentPlayer + 1) % 3].cards;
      let lastPlayerHighTrump = lastPlayerCards.J[0] || (lastPlayerCards[gameType][0]) || null;
      if (card.isTrump(gameType)) {
        if (!card.isTrump(currentTrick[0], gameType) && lastPlayerCards[currentTrick[0].suit].length > 0) {
          return true;
        }
        return lastPlayerHighTrump === null || card.beatsCard(lastPlayerHighTrump, gameType);
      }
      if (lastPlayerCards[card.suit].length && card.beatsCard(lastPlayerCards[card.suit][0], gameType)) {
        return true;
      }
      return lastPlayerHighTrump === null;
    }
    case 2: {
      let winnerIndex = currentTrick[1].beatsCard(currentTrick[0], gameType) ? 1 : 0;
      return card.beatsCard(currentTrick[winnerIndex], gameType);
    }
    default:
      return false;
    }
  }

  static cannotWinTrick(card, game) {
    if (game.currentPlayer !== game.soloPlayer) {
      // TODO: implement
      return false;
    }
    let { gameType } = game;
    switch (game.currentTrick.length) {
    case 0: {
      let newGame = game.clone();
      newGame.playCard(card);
      let possibleCards = Strategy.getPossibleMoves(game);
      if (possibleCards.every(nextCard => nextCard.beatsCard(card, gameType))) {
        return true;
      }
      // this is a little hack: we force the next player to skip a turn by forcing the currentPlayer
      newGame.currentPlayer = (newGame.currentPlayer + 1) % 3;
      possibleCards = Strategy.getPossibleMoves(game);
      return possibleCards.every(nextCard => nextCard.beatsCard(card, gameType));
    }
    case 1: {
      if (!card.beatsCard(game.currentTrick[0], gameType)) {
        return true;
      }
      // TODO: optimize
      let newGame = game.clone();
      newGame.playCard(card);
      let possibleCards = Strategy.getPossibleMoves(game);
      return possibleCards.every(nextCard => nextCard.beatsCard(card, gameType));
    }
    case 2:
      return !this.mustWinTrick(card, game);
    default:
      return false;
    }
  }
}
