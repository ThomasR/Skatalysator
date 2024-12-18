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

import { Card } from './Card.mjs';
import { PrettyLogging } from '../PrettyLogging.mjs';
import { suitToSymbol } from './Suit.mjs';
import { Trick } from './Trick.mjs';
import { CardDistribution } from './CardDistribution.mjs';
import { GameType } from './GameType.mjs';

export class Game extends PrettyLogging {
  soloPlayer;
  currentPlayer;
  gameType;
  distribution;
  playedTricks;
  pointsSolo;
  pointsDuo;
  currentTrick;

  constructor({
    soloPlayer,
    currentPlayer,
    gameType,
    distribution,
    playedTricks = [],
    pointsSolo = 0,
    pointsDuo = 0,
    currentTrick
  } = {}) {
    super();
    this.soloPlayer = soloPlayer;
    this.currentPlayer = currentPlayer;
    this.gameType = gameType;
    this.distribution = new CardDistribution(distribution, gameType);
    this.playedTricks = playedTricks.map(trickInput => new Trick({ ...trickInput, gameType }));
    let minPointsSolo = this.distribution.skat.reduce((a, b) => a + b.value, 0);
    this.pointsSolo = Math.max(pointsSolo, minPointsSolo);
    this.pointsDuo = pointsDuo;
    this.currentTrick = new Trick(currentTrick ?? { leadPlayer: this.currentPlayer });
  }

  playCard(cardInput) {
    if (this.isOver()) {
      throw new Error('Cannot play card after game is over');
    }
    let card = new (Card(this.gameType))(cardInput);
    this.distribution.removeCard(card, this.currentPlayer);
    this.currentTrick.playCard(card);
    if (this.currentTrick.length === 3) {
      this.#resolveCurrentTrick();
    } else {
      this.currentPlayer = (this.currentPlayer + 1) % 3;
    }
  }

  undoLastMove() {
    if (this.playedTricks.length === 0 && this.currentTrick.cards.length === 0) {
      throw new Error('Undo stack is empty');
    }
    if (!this.currentTrick || this.currentTrick.length === 0) {
      this.currentTrick = this.playedTricks.pop();
      let winningPlayer = this.currentTrick.winningPlayer;
      delete this.currentTrick.winningPlayer;
      if (winningPlayer === this.soloPlayer) {
        this.pointsSolo -= this.currentTrick.value;
      } else {
        this.pointsDuo -= this.currentTrick.value;
      }
      if (this.gameType === GameType.NULL) {
        this.pointsSolo = 0;
        this.pointsDuo = 0;
      }
    }
    let lastPlayedCard = this.currentTrick.cards.pop();
    let lastCardPlayer = (this.currentTrick.leadPlayer + this.currentTrick.length) % 3;
    this.distribution.addCard(lastPlayedCard, lastCardPlayer);
    this.currentPlayer = lastCardPlayer;
  }

  #resolveCurrentTrick() {
    let {
      winningPlayer,
      score
    } = this.currentTrick.resolve(this.gameType);
    if (winningPlayer === this.soloPlayer) {
      this.pointsSolo += score;
      if (this.gameType === GameType.NULL) {
        this.pointsSolo = -1;
        this.pointsDuo = 1;
      }
    } else {
      this.pointsDuo += score;
    }
    this.playedTricks.push(this.currentTrick);
    if (this.isOver()) {
      this.currentTrick = null;
      this.currentPlayer = null;
      if (this.gameType === GameType.NULL && this.pointsDuo === 0) {
        this.pointsSolo = 1;
        this.pointsDuo = -1;
      }
    } else {
      this.currentTrick = new Trick({ leadPlayer: winningPlayer });
      this.currentPlayer = winningPlayer;
    }
  }

  isOver() {
    return this.playedTricks.length === 10 || (this.gameType === GameType.NULL && this.pointsDuo === 1);
  }

  get isCurrentPlayerSolo() {
    return this.currentPlayer === this.soloPlayer;
  }

  get soloHasMadeTrick() {
    return this.playedTricks.some(trick => trick.winningPlayer === this.soloPlayer);
  }

  get duoHasMadeTrick() {
    return this.playedTricks.some(trick => trick.winningPlayer !== this.soloPlayer);
  }

  clone() {
    return new Game({
      ...this,
      distribution: this.distribution.clone(),
      playedTricks: this.playedTricks.map(trick => trick.clone()),
      currentTrick: this.currentTrick?.clone()
    });
  }

  get playedCardCount() {
    return this.playedTricks.length * 3 + this.currentTrick.length;
  }

  toString() {
    let trumpString;
    if (this.gameType === null) {
      trumpString = 'Null';
    } else if (this.gameType === -1) {
      trumpString = 'Grand';
    } else {
      trumpString = suitToSymbol(this.gameType);
    }
    let result = `-----\nGame: Player ${this.soloPlayer + 1} plays ${trumpString}`;
    result += `\n${this.distribution}`;
    if (this.currentTrick?.length) {
      result += `\nTable: ${this.currentTrick} --`;
      if (this.currentTrick.length === 1) {
        result += ' --';
      }
    }
    if (this.isOver()) {
      result += '\nFinal ';
    } else {
      result += `\nPlayer ${this.currentPlayer + 1} to move\n`;
    }
    result += `Score: ${this.pointsSolo}:${this.pointsDuo}`;
    if (this.playedTricks.length) {
      result += `\n\nHistory:\n${this.playedTricks.join('\n')}`;
    }
    result += '\n-----';
    return result;
  }
}
