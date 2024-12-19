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
import { AbstractMoveOrderSearch } from './AbstractMoveOrderSearch.mjs';

const { min, max } = Math;

/**
 * AbstractTranspositionTableSearch is an abstract class that extends the AbstractABSearch class
 * to provide caching functionality for search algorithms using a transposition table.
 * This class is designed to optimize search algorithms by reusing previously computed results
 * and reducing redundant computations.
 *
 * This is an adaptation of ab_tt from
 * https://gki.informatik.uni-freiburg.de/papers/kupferschmid-diplomarbeit2003.pdf#page=28
 *
 * Subclasses must implement certain methods such as `getHash` to define specific behaviors,
 * while other methods, like `shouldUseCache`, can be overridden to modify default behavior.
 * By utilizing this design, the class ensures flexibility for different types of search implementations.
 *
 * Internals:
 * Note that the algorithm in the paper above is buggy: the last hash.add() should only be called if a
 * move was found. That's why we introduce AbstractABSearch.resultTypes here.
 */
export class AbstractTranspositionTableSearch extends AbstractMoveOrderSearch {

  #cache = new Map();

  /** @override */
  preIterationHook({ alpha, beta }) {
    let useCache = this.shouldUseCache();
    let returnScore = null;
    let hash = null;

    if (useCache) {
      hash = this.getHash();
      let cached = this.#cache.get(hash);

      if (cached) {
        let { score, flag } = cached;
        switch (flag) {
        case AbstractABSearch.resultTypes.BETA_CUTOFF:
          alpha = max(alpha, score);
          break;
        case AbstractABSearch.resultTypes.ALPHA_CUTOFF:
          beta = min(beta, score);
          break;
        case AbstractABSearch.resultTypes.FINAL:
          returnScore = score;
          break;
        default:
          throw new Error(`Unknown cache entry type ${flag}`);
        }
        if (alpha >= beta) {
          returnScore = score;
        }
      }
    }

    return { alpha, beta, score: returnScore, memo: { useCache, hash } };
  }

  /** @override */
  postIterationHook({ score, resultType, memo: { useCache, hash } }) {
    if (useCache) {
      if (resultType !== AbstractABSearch.resultTypes.NONE) {
        this.#cache.set(hash, { score, flag: resultType });
      }
    }
  }

  get cacheSize() {
    return this.#cache.size;
  }


  // default method implementations


  /**
   * Determines whether caching should be used in the current context.
   * This method is intended to be overwritten by subclasses.
   *
   * @return {boolean} Returns true if caching should be applied, otherwise false.
   */
  /* eslint-disable class-methods-use-this */
  shouldUseCache() {
    return true;
  }


  // abstract methods. must be implemented in subclasses


  /* eslint-disable getter-return, no-unused-vars, class-methods-use-this */
  getHash() {
    this.#implementMe;
  }

  get #implementMe() {
    throw new Error('Not implemented');
  }
}
