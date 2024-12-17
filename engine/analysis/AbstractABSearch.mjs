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

/**
 * This class provides the foundation for search algorithms that operate on a game state
 * and leverage a transposition table (cache) for optimization. It implements mechanisms
 * to store and retrieve cached results during the search to improve performance.
 *
 *
 * Subclasses are expected to implement specific methods (e.g., `getHash`) and can
 * override optional methods like `shouldUseCache` to modify behavior.
 */
export class AbstractABSearch {

  static resultTypes = {
    FINAL: Symbol('FINAL'),
    ALPHA_CUTOFF: Symbol('ALPHA_CUTOFF'),
    BETA_CUTOFF: Symbol('BETA_CUTOFF'),
    NONE: Symbol('NONE')
  };

  game;

  /**
   * The `game` object is passed by reference, meaning any changes made to the `game`
   * state within the methods will directly affect the original object.
   * Users of this class should handle the game state carefully to avoid unintentional
   * side effects.
   */
  constructor({ game }) {
    this.game = game;
  }

  /**
   * Returns the score of the current position, given optimal play.
   * The return value is the solo player's final points.
   */
  minimax({ alpha = -Infinity, beta = Infinity } = {}) {
    return this.gameScore + this._abSearch({ alpha, beta });
  }

  /**
   * This is an adaptation of the ab algorithm from
   * https://gki.informatik.uni-freiburg.de/papers/kupferschmid-diplomarbeit2003.pdf#page=23
   * It returns the score delta possible starting from the current position
   * within the alpha-beta search window given.
   */
  _abSearch({ alpha = -Infinity, beta = Infinity, recursionDepth = 0 }) {

    if (this.isGameOver()) {
      return this.gameEndScore;
    }

    let isMaximizer = this.isMaximizer;

    let { alpha: updatedAlpha, beta: updatedBeta, score: returnScore, memo } =
      this.preIterationHook({ alpha, beta });
    if (typeof returnScore === 'number') {
      return returnScore;
    }
    alpha = updatedAlpha;
    beta = updatedBeta;

    let isCutoff = false;

    let foundMove = false;
    for (let move of this.getMoveCandidates()) {

      this.innerIterationStartHook({ move, alpha, beta });

      let scoreBefore = this.gameScore;
      this.playMove(move);
      let lastMoveScore = this.gameScore - scoreBefore;

      let moveScore = lastMoveScore + this._abSearch({
        alpha: alpha - lastMoveScore,
        beta: beta - lastMoveScore,
        recursionDepth: recursionDepth + 1
      });

      this.undoLastMove();

      if (isMaximizer) {
        if (moveScore > alpha) {
          foundMove = true;
          this.scoreImprovedHook({ move, lastMoveScore, moveScore, alpha, beta, isMaximizer });
          alpha = moveScore;
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (moveScore < beta) {
          foundMove = true;
          this.scoreImprovedHook({ move, lastMoveScore, moveScore, alpha, beta, isMaximizer });
          beta = moveScore;
        }
      }

      isCutoff = alpha >= beta;

      this.innerIterationEndHook({ move, isCutoff, alpha, beta, isMaximizer });

      if (isCutoff) {
        break;
      }
    }

    let score = isMaximizer ? alpha : beta;
    this.#callPostHook({ score, isCutoff, foundMove, memo });
    return score;
  }


  #callPostHook({ score, isCutoff, foundMove, memo }) {
    let resultType = AbstractABSearch.resultTypes.NONE;
    if (isCutoff) {
      resultType = this.isMaximizer
        ? AbstractABSearch.resultTypes.BETA_CUTOFF
        : AbstractABSearch.resultTypes.ALPHA_CUTOFF;
    } else if (foundMove) {
      resultType = AbstractABSearch.resultTypes.FINAL;
    }
    this.postIterationHook({ score, resultType, memo });
  }

  // default method implementations


  /**
   * Executed before iteration over possible moves.
   * Allows to adjust the alpha and beta cutoff boundaries.
   *
   * @return {Object} - Returns an object containing the updated `alpha` and `beta` values.
   * Can also contain a `returnValue` property which will be returned by _abSearch immediately.
   * Additionally, it can have a `memo` property that will be passed to #postIterationHook
   */

  /* eslint-disable no-unused-vars, class-methods-use-this */
  preIterationHook({ alpha, beta }) {
    return { alpha, beta };
  }

  /**
   * Executed after iteration over possible moves.
   * By default, it does nothing but can be overridden to add custom logic.
   */
  postIterationHook({ score, resultType, memo }) {
    // default implementation does nothing
  }

  /**
   * Executed before examining a specific move.
   * By default, it does nothing but can be overridden to add custom logic.
   */
  innerIterationStartHook({ move, alpha, beta }) {
  }

  /**
   * Executed after examining a specific move.
   * By default, it does nothing but can be overridden to add custom logic.
   */
  innerIterationEndHook({ move, isCutoff, alpha, beta, isMaximizer }) {
  }

  /**
   * Executed when a new best move is found while iterating over all candidates.
   * By default, it does nothing but can be overridden to add custom logic.
   */
  scoreImprovedHook({ move, lastMoveScore, moveScore, alpha, beta, isMaximizer }) {
  }

  /**
   * Returns the score for an ended game.
   * Can be overwritten in subclasses to account for bonus points hidden in the
   * final game state.
   */
  get gameEndScore() {
    return 0;
  }


  // abstract methods. must be implemented in subclasses


  /* eslint-disable getter-return, no-unused-vars, class-methods-use-this */
  isGameOver() {
    this.#implementMe;
  }

  get gameScore() {
    this.#implementMe;
  }

  get isMaximizer() {
    this.#implementMe;
  }

  getMoveCandidates() {
    this.#implementMe;
  }

  playMove(move) {
    this.#implementMe;
  }

  undoLastMove() {
    this.#implementMe;
  }

  get #implementMe() {
    throw new Error('Not implemented');
  }
}
