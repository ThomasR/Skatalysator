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

/*
* An adaption of classical alpha-beta search for the game of Skat.
* Inspired by https://artint.info/3e/html/ArtInt3e.Ch14.S3.html
* Internals: The game score is tracked as points of the solo player.
* So, for the other team, lower score is better.
* There are 2 cut-off points:
* 1. evaluating the current game situation without playing a card.
*    Cutoff happens when there are not enough points left to beat the current best.
* 2. exploring the situation after a card is played, which includes recursion
*/

/* eslint-disable class-methods-use-this */
export class AbstractAlphaBetaSearch {

  game;

  constructor({ game }) {
    if (this.constructor === AbstractAlphaBetaSearch.constructor) {
      throw new Error('Cannot instantiate abstract class');
    }
    this.game = game;
  }

  minimax({
    // "alpha"
    bestSoloScore = Number.NEGATIVE_INFINITY,
    // "beta"
    bestDuoScore = Number.POSITIVE_INFINITY,
    isPrevPlayerSolo,
    recursionDepth = 0
  } = {}) {

    if (this.hasGameEnded()) {
      return {
        score: this.getScoreOfEndedGame()
      };
    }

    let { currentPlayer, isCurrentPlayerSolo } = this.getPlayerInfo();

    let early = this.getEarlyCutoff({ currentPlayer, isPrevPlayerSolo, bestSoloScore, bestDuoScore });
    if (early) {
      return early;
    }

    let bestMoves = [];
    let bestIsCutoff = false;

    let candidates = this.getMoveCandidates();

    for (let card of candidates) {

      this.playCard(card);
      let { score, moves = [], isCutoff = false } = this.minimax({
        bestSoloScore,
        bestDuoScore,
        isPrevPlayerSolo: isCurrentPlayerSolo,
        recursionDepth: recursionDepth + 1
      });
      this.undoLastMove();

      if (this.isLateCutoff({
        isCurrentPlayerSolo,
        isPrevPlayerSolo,
        score,
        bestSoloScore,
        bestDuoScore
      })) {
        return { score, isCutoff: true };
      }

      if (isCurrentPlayerSolo && score > bestSoloScore) {
        bestSoloScore = score;
        bestMoves = [card, ...moves];
        bestIsCutoff = isCutoff;
      }

      if (!isCurrentPlayerSolo && score < bestDuoScore) { // lower is better
        bestDuoScore = score;
        bestMoves = [card, ...moves];
        bestIsCutoff = isCutoff;
      }
    }

    let result = {
      score: isCurrentPlayerSolo ? bestSoloScore : bestDuoScore,
      moves: bestMoves,
      forced: candidates.length === 1
    };

    if (recursionDepth > 0) {
      result.isCutoff = bestIsCutoff;
    }

    return result;

  }

  getEarlyCutoff({ isPrevPlayerSolo, bestSoloScore, bestDuoScore }) {
    let evaluation = this.evaluateGame({ isPrevPlayerSolo });
    let { score } = evaluation;
    if (this.isEarlyCutoff({ isPrevPlayerSolo, score, bestSoloScore, bestDuoScore })) {
      return { ...evaluation, isCutoff: true };
    }
  }

  isEarlyCutoff({ isPrevPlayerSolo, score, bestSoloScore, bestDuoScore }) {
    if (isPrevPlayerSolo) {
      return score <= bestSoloScore;
    } else {
      return score >= bestDuoScore;
    }
  }

  isLateCutoff({ isCurrentPlayerSolo, isPrevPlayerSolo, score, bestSoloScore, bestDuoScore }) {
    if (isPrevPlayerSolo) {
      // alpha cutoff
      // Has the duo team found a counterplay that beats the solo player's current best choice?
      return score <= bestSoloScore;
    } else {
      // This is the significant difference to the classic alpha-beta algorithm.
      // Pruning only happens when the teams are different.
      if (isCurrentPlayerSolo) {
        // beta cutoff
        // Has the solo player found a counterplay that beats the opposing team's current best choice?
        return score >= bestDuoScore;
      }
      // When the current player is in the same team as the previous one, we need to explore all options.
      return false;
    }
  }


  /* abstract methods */


  /* eslint-disable no-unused-vars */

  evaluateGame({ isPrevPlayerSolo }) {
    // Dummy implementation.
    // Subclasses should return a deterministic minimal score for the current game situation
    // For example, if the solo player can make all remaining points, it could return a score of
    // this.game.pointsSolo + futurePoints.
    // If the solo player is has trump A,10, and all Jacks are gone, it could return this.game.pointsSolo + 21
    // etc.
    return { score: isPrevPlayerSolo ? 120 - this.game.pointsDuo : this.game.pointsSolo };
  }

  playCard(card) {
    AbstractAlphaBetaSearch.#implementMe;
  }

  undoLastMove() {
    AbstractAlphaBetaSearch.#implementMe;
  }

  getPlayerInfo() {
    AbstractAlphaBetaSearch.#implementMe;
  }

  hasGameEnded() {
    AbstractAlphaBetaSearch.#implementMe;
  }

  getScoreOfEndedGame() {
    AbstractAlphaBetaSearch.#implementMe;
  }

  getMoveCandidates() {
    AbstractAlphaBetaSearch.#implementMe;
  }

  static get #implementMe() {
    throw new Error('Method must be implemented in subclass');
  }
}
