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

import { Strategy } from '../../engine/Strategy.mjs';

const workerURL = import.meta.resolve('./worker.mjs');

export class FullGameAnalyzer {
  game;
  onStart;
  onResult;
  onEnd;
  worker;

  constructor({
    game,
    onStart,
    onResult,
    onEnd
  }) {
    if (!game) {
      throw new Error('Must pass a game');
    }
    this.game = game.clone();
    if (!onStart || !onResult || !onEnd) {
      throw new Error('Must pass onStart, onResult and onEnd callbacks!');
    }
    this.onStart = onStart;
    this.onResult = onResult;
    this.onEnd = onEnd;
  }

  startAnalysis() {
    let doneIndexes = this.#findForcedMoves();
    this.#launchWorker(doneIndexes);
  }

  cancelAnalysis() {
    if (this.worker) {
      this.worker.terminate();
      this.onEnd('cancel');
    }
    this.worker = null;
  }

  #findForcedMoves() {
    let doneIndexes = [];
    let cardCount = 3 * this.game.playedTricks.length + this.game.currentTrick.length;
    let tempGame = this.game.clone();
    for (let i = 0; i < cardCount; i++) {
      if (i === 0 && cardCount === 30) {
        tempGame.undoLastMove();
        continue;
      }
      let isOnlyMove = Strategy.getPossibleMoves(tempGame).length === 1;
      if (isOnlyMove) {
        this.onResult({
          analyzedTrickIndex: tempGame.playedTricks.length,
          analyzedCardIndex: tempGame.currentTrick.length,
          forced: true
        });
        doneIndexes.push(i);
      }
      tempGame.undoLastMove();
    }
    return doneIndexes;
  }

  #launchWorker(skipIndexes) {
    if (this.worker) {
      return;
    }
    this.worker = new Worker(workerURL, { type: 'module' });
    this.worker.addEventListener('message', this.#onMessage.bind(this));
    this.worker.postMessage({ game: this.game, skip: skipIndexes });
  }

  #onMessage({ data }) {
    switch (data.type) {
    case 'start':
      this.onStart(data.payload);
      break;
    case 'result': {
      this.onResult(data.payload);
      break;
    }
    case 'timeout':
      this.onEnd('timeout');
      break;
    case 'end':
      this.onEnd('normal');
      break;
    default:
      throw new Error(`Unknown message from worker: ${JSON.stringify(data)}`);
    }
  }
}
