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

import { SkatalysatorSearch } from './SkatalysatorSearch.mjs';

export class LoggingSkatalysatorSearch extends SkatalysatorSearch {

  logger = null;
  #passedLogger;
  logDepth;

  constructor(...args) {
    super(...args);
    let { logger: passedLogger, logDepth } = args[0] ?? {};
    this.#passedLogger = passedLogger || console;
    this.logDepth = logDepth ?? -1;
  }

  setLogger({ recursionDepth }) {
    if (this.logDepth >= recursionDepth) {
      this.logger = {
        ...this.#passedLogger,
        log: (...args) => {
          if (recursionDepth) {
            this.#passedLogger.log(recursionDepth, ...args);
          } else {
            this.#passedLogger.log(...args);
          }
        }
      };
    } else {
      this.logger = null;
    }
  }

  /** @override */
  _abSearch(...args) {
    let { alpha, beta, recursionDepth = 0 } = args[0];

    let prevLogger = this.logger;
    this.setLogger({ recursionDepth });

    if (recursionDepth > 0) {
      this.logger?.groupCollapsed();
    }
    this.logger?.log(`Entering abSearch with α=${alpha}, β=${beta}. ${this.isMaximizer ? 'MAXIMIZING…' : 'minimizing…'}`);

    let result = super._abSearch(...args);

    this.logger?.groupEnd();
    if (recursionDepth === 0) {
      this.logger?.log('Cache size', this.cacheSize);
    }
    this.logger = prevLogger;
    return result;
  }

  /** @override */
  preIterationHook({ alpha, beta }) {
    let result = super.preIterationHook({ alpha, beta });
    let { alpha: updatedAlpha, beta: updatedBeta, score: returnScore } = result;
    if (typeof returnScore === 'number') {
      this.logger?.log(`Returning cached score: ${returnScore}`);
    } else {
      if (updatedAlpha !== alpha) {
        this.logger?.log(`Updating α to cached value ${updatedAlpha}`);
      }
      if (updatedBeta !== beta) {
        this.logger?.log(`Updating β to cached value ${updatedBeta}`);
      }
    }
    return result;
  }

  /** @override */
  innerIterationStartHook({ move, alpha, beta }) {
    this.logger?.log(`Examining ${move} with bounds [${alpha}, ${beta}]`);
  }

  /** @override */
  scoreImprovedHook({ move, moveScore, lastMoveScore, alpha, beta, isMaximizer }) {
    if (lastMoveScore) {
      this.logger?.log(`${move} wins the trick with ${lastMoveScore} points.`);
    }
    if (isMaximizer) {
      this.logger?.log(`${move} is now best with score ${lastMoveScore ? `${lastMoveScore} + ${moveScore - lastMoveScore} = ` : ''}${moveScore} > ${alpha}.`);
    } else {
      this.logger?.log(`${move} is now best with score ${lastMoveScore ? `${lastMoveScore} + ${moveScore - lastMoveScore} = ` : ''}${moveScore} < ${beta}.`);
    }
  }

  /** @override */
  innerIterationEndHook({ move, isCutoff, alpha, beta, isMaximizer }) {
    if (isCutoff) {
      this.logger?.log(`${move} is cutoff. Score: ${isMaximizer ? alpha : beta}`);
    }
  }

  /** @override */
  postIterationHook({ score, resultType, memo }) {
    super.postIterationHook({ score, resultType, memo });
    this.logger?.log(`Score: ${score}, Result: ${String(resultType).replace(/Symbol\((.*)\)/, '$1')}`);
  }

  /** @override */
  isGameOver() {
    let over = super.isGameOver();
    if (over) {
      this.logger?.log('Game over. No more points left.');
    }
    return over;
  }

  /** @override */
  getMoveCandidates() {
    let result = super.getMoveCandidates();
    this.logger?.log('Move candidates:', result.join(' '));
    return result;
  }
}
