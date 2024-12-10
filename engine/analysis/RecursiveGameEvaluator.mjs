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

import { CachingSkatalysatorAlphaBetaSearch as AlphaBeta } from './CachingSkatalysatorAlphaBetaSearch.mjs';
import { GameType } from '../model/GameType.mjs';

export class RecursiveGameEvaluator {

  alphabeta;

  constructor(...args) {
    this.alphabeta = new AlphaBeta(...args);
  }

  evaluateGame() {

    let result = this.alphabeta.minimax();

    if (this.alphabeta.game.gameType === GameType.NULL) {
      return result;
    }

    let { score } = result;
    let pointsSolo = Math.max(0, Math.min(score, 120));

    return {
      ...result,
      score,
      pointsSolo,
      pointsDuo: 120 - pointsSolo
    };
  }
}
