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

import { AbstractTranspositionTableSearch } from './AbstractTranspositionTableSearch.mjs';
import { Strategy } from '../Strategy.mjs';
import { GameHasher } from './GameHasher.mjs';

export class SkatalysatorSearch extends AbstractTranspositionTableSearch {

  /** @override */
  isGameOver() {
    return this.game.isOver();
  }

  /** @override */
  get gameScore() {
    return this.game.pointsSolo;
  }

  /** @override */
  get gameEndScore() {
    if (!this.game.soloHasMadeTrick) {
      return -1;
    }
    if (!this.game.duoHasMadeTrick) {
      return 1;
    }
    return 0;
  }

  /** @override */
  get isMaximizer() {
    return this.game.isCurrentPlayerSolo;
  }

  /** @override */
  getMoveCandidates() {
    let result = Strategy.getPossibleMoves(this.game);
    return result.sort((a, b) => a.value - b.value);
  }

  /** @override */
  playMove(move) {
    this.game.playCard(move);
  }

  /** @override */
  undoLastMove() {
    this.game.undoLastMove();
  }

  /** @override */
  getHash() {
    return `${GameHasher.hash(this.game)}`;
  }

  /** @override */
  shouldUseCache() {
    return this.game.currentTrick.length === 0 && this.game.playedTricks.length < 9;
  }
}
