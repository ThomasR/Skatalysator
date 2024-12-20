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

import { AbstractABSearch } from './AbstractABSearch.mjs';

export class AbstractMoveOrderSearch extends AbstractABSearch {

  /** @override */
  getMoveCandidates() {
    let result = this.getAllPossibleMoves();
    return this.sortByGuessedQuality(result);
  }


  // default method implementations


  /**
   * Sorts an array of move objects based on their estimated quality. Optimizing the order of moves is critical
   * to improve the efficiency of the Alpha-Beta search algorithm.
   *
   * By prioritizing high-quality moves, the search can focus on the most promising game continuations first,
   * potentially reducing search depth and computational overhead. Additionally, moves with smaller resulting
   * subtrees (i.e., fewer game continuations) can improve performance by minimizing unnecessary branching in the search.
   *
   * This method is intended to be overridden by subclasses to provide specific sorting logic.
   * The default implementation does not alter the order of moves.
   */
  /* eslint-disable class-methods-use-this */
  sortByGuessedQuality(moves) {
    return moves;
  }


  // abstract methods. must be implemented in subclasses


  /* eslint-disable getter-return, no-unused-vars, class-methods-use-this */


  getAllPossibleMoves() {
    this.#implementMe;
  }

  get #implementMe() {
    throw new Error('Not implemented');
  }

}
