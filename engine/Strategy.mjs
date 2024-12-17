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

export class Strategy {

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

}
