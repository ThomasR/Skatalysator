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

export class CachingSkatalysatorAlphaBetaSearch extends LoggingSkatalysatorAlphaBetaSearch {

  #caches = [new Map(), new Map(), new Map()];

  minimax(...args) {
    if (this.game.isOver()) {
      return super.minimax(...args);
    }

    const { bestSoloScore = Number.NEGATIVE_INFINITY, bestDuoScore = Number.POSITIVE_INFINITY } = args[0] ?? {};
    let currentPoints = this.game.pointsSolo;
    let hash = `${this.game.toHash()},${currentPoints},${bestSoloScore},${bestDuoScore}`;

    let cache = this.#caches[this.game.currentPlayer ?? 0];
    let cached = cache.get(hash);
    if (!cached) {
      cached = super.minimax(...args);
      cache.set(hash, cached);
    }
    return cached;
  }

  get cacheSize() {
    return this.#caches[0].size + this.#caches[1].size + this.#caches[2].size;
  }
}
