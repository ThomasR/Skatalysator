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

import { LoggingSkatalysatorAlphaBetaSearch } from './LoggingSkatalysatorAlphaBetaSearch.mjs';

// TODO: make configurable
const AGGRESSIVE_CACHING = false;

export class CachingSkatalysatorAlphaBetaSearch extends LoggingSkatalysatorAlphaBetaSearch {

  #transpositionTables = [new Map(), new Map(), new Map()];


  minimax(...args) {

    if (!this.useCache()) {
      return super.minimax(...args);
    }

    const {
      bestSoloScore = Number.NEGATIVE_INFINITY,
      bestDuoScore = Number.POSITIVE_INFINITY,
      recursionDepth = 0,
      logger = console
    } = args[0] ?? {};

    let hash = `${this.game.toHash()},${bestSoloScore},${bestDuoScore}`;

    let cache = this.#transpositionTables[this.game.currentPlayer ?? 0];
    let cached = cache.get(hash);
    if (!cached) {
      cached = super.minimax(...args);
      cache.set(hash, cached);
    }
    if (recursionDepth === 0 && this.logDepth) {
      logger.log('Cache size: ', this.cacheSize);
    }
    return cached;
  }

  useCache() {
    if (this.game.isOver()) {
      return false;
    }
    let remainingCardCount = 30 - (this.game.playedTricks.length * 3 + this.game.currentTrick.length);
    if (remainingCardCount <= (AGGRESSIVE_CACHING ? 0 : 3)) {
      return false;
    }
    return remainingCardCount % 3 === 0;
  }

  get cacheSize() {
    return this.#transpositionTables.reduce((total, table) => total + table.size, 0);
  }
}
