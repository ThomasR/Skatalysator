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

import { AbstractAlphaBetaSearch } from './AbstractAlphaBetaSearch.mjs';
import { ColorGameStrategy } from '../ColorGameStrategy.mjs';
import { DistributionAnalyzer } from './DistributionAnalyzer.mjs';
import { GrandStrategy } from '../GrandStrategy.mjs';
import { NullStrategy } from '../NullStrategy.mjs';
import { GameType } from '../model/GameType.mjs';

export class SkatalysatorAlphaBetaSearch extends AbstractAlphaBetaSearch {

  strategy;

  constructor(...args) {
    super(...args);
    let { game } = args[0];
    if (game.gameType === GameType.GRAND) {
      this.strategy = new GrandStrategy(game);
    } else if (game.gameType === GameType.NULL) {
      this.strategy = new NullStrategy(game);
    } else {
      this.strategy = new ColorGameStrategy(game);
    }
  }

  hasGameEnded() {
    return this.game.isOver();
  }

  getScoreOfEndedGame() {
    if (this.game.isSoloBlack) {
      return -1;
    }
    if (this.game.isDuoBlack) {
      return 121;
    }
    return this.game.pointsSolo;
  }

  getMoveCandidates() {
    return this.strategy.getBestMoveCandidates();
  }

  getPlayerInfo() {
    return {
      currentPlayer: this.game.currentPlayer,
      isCurrentPlayerSolo: this.game.isCurrentPlayerSolo
    };
  }

  playCard(card) {
    this.game.playCard(card);
  }

  undoLastMove() {
    this.game.undoLastMove();
  }

  getEarlyCutoff(...args) {
    if (this.game.playedTricks.length >= 9) {
      return;
    }
    let dominantStrategy = this.strategy.getDominantStrategy();
    if (dominantStrategy) {
      return dominantStrategy;
    }
    return super.getEarlyCutoff(...args);
  }

  evaluateGame({ isPrevPlayerSolo }) {
    let extra = DistributionAnalyzer.getGuaranteedPoints({
      distribution: this.game.distribution,
      forSoloPlayer: !isPrevPlayerSolo,
      soloPlayer: this.game.soloPlayer
    });
    let score = isPrevPlayerSolo ? 120 - this.game.pointsDuo - extra : this.game.pointsSolo + extra;
    return {
      score
    };
  }
}
