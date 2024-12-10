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

import { SkatalysatorAlphaBetaSearch } from './SkatalysatorAlphaBetaSearch.mjs';
import { gameToSymbol } from '../model/GameType.mjs';

export class LoggingSkatalysatorAlphaBetaSearch extends SkatalysatorAlphaBetaSearch {
  originalLogger;
  logger = null;
  logDepth;

  constructor({ game, logger = console, logDepth = 0 }) {
    super({ game });
    this.originalLogger = logger;
    this.logDepth = logDepth;
  }

  minimax(args) {

    let card;
    let isMaximizer;
    if (this.logger) {
      isMaximizer = args.isPrevPlayerSolo;
      let currentTrick = (this.game.currentTrick && this.game.currentTrick.length) ?
        this.game.currentTrick :
        this.game.playedTricks.at(-1);
      card = currentTrick.cards.at(-1);
      let playerIndex = (currentTrick.leadPlayer + currentTrick.length - 1) % 3;
      this.logger?.group(`Player ${playerIndex + 1} (${isMaximizer ? 'max' : 'min'}) trying card ${card}`);
      this.logger?.log(`α=${args.bestSoloScore}, β=${args.bestDuoScore}`);
    }

    let previousLogger = this.logger;
    let { recursionDepth = 0 } = args ?? {};
    if (recursionDepth >= this.logDepth) {
      this.logger = null;
    } else {
      this.logger = this.originalLogger;
    }

    if (recursionDepth === 0) {
      this.logger?.log(`Entering minimax. Solo player is player ${this.game.soloPlayer + 1}, playing ${gameToSymbol(this.game.gameType)}.`);
      this.logger?.time('Total analysis time');
    }

    let result = super.minimax(args);

    this.logger?.log('Best:', result.moves?.join(' ') || 'unknown',
      result.isCutoff ? '(cutoff)' : '',
      result.hint === 'domination' ? '(rest is here)' : '');

    if (recursionDepth === 0) {
      this.logger?.timeEnd('Total analysis time');
    }

    this.logger = previousLogger;

    this.logger?.groupEnd(`Trying card ${card}`);
    this.logger?.log(`Score for ${card}: ${result.isCutoff ? (isMaximizer ? '<=' : '>=') : ''}${result.score}`
      + `${result.isCutoff ? ' - discarding' : ''}`);

    return result;
  }

  hasGameEnded() {
    let result = super.hasGameEnded();
    if (result) {
      this.logger?.log('End of game');
    }
    return result;
  }

  isLateCutoff(args) {
    let result = super.isLateCutoff(args);
    if (result) {
      this.logger?.log(`Cutoff at ${args.isCurrentPlayerSolo ? args.bestDuoScore : args.bestSoloScore}.`);
    }
    return result;
  }

}
