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


import { SkatalysatorSearch } from './SkatalysatorSearch.mjs';

/**
 * Extends SkatalysatorSearch to track the cards that lead to the optimal score
 * determined by the minimax() algorithm. After minimax() is executed,
 * these cards are stored in the `bestMoves` property.
 */
export class TrackingSkatalysatorSearch extends SkatalysatorSearch {

  bestMoves = [];

  _abSearch(...args) {
    let { recursionDepth = 0 } = args[0];
    let score = super._abSearch(...args);
    if (recursionDepth === 0) {
      this.#captureBestMoves(score);
    }
    return score;
  }

  #captureBestMoves(score) {
    this.bestMoves = [];
    let isMaximizer = this.isMaximizer;
    let pointsBefore = this.game.pointsSolo;
    for (let move of this.getMoveCandidates()) {
      this.playMove(move);
      let pointsDelta = this.game.pointsSolo - pointsBefore;
      let targetScore = score - pointsDelta;
      let params = isMaximizer ? { beta: targetScore } : { alpha: targetScore };
      let moveScore = super._abSearch(params);
      if (moveScore + pointsDelta === score) {
        this.bestMoves.push(move);
      }
      this.undoLastMove();
    }
  }
}
