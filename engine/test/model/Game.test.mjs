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

import test from 'node:test';
import assert from 'node:assert';
import { Game } from '../../model/Game.mjs';
import { Trick } from '../../model/Trick.mjs';
import { GameType } from '../../model/GameType.mjs';


test.describe('Game', () => {
  test('should initialize the game with correct default values', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.NULL,
      distribution: {
        hands: [],
        skat: []
      }
    });

    assert.strictEqual(game.soloPlayer, 1);
    assert.strictEqual(game.currentPlayer, 0);
    assert.strictEqual(game.gameType, GameType.NULL);
    assert.strictEqual(game.playedTricks.length, 0);
    assert.strictEqual(game.pointsSolo, 0);
    assert.strictEqual(game.pointsDuo, 0);
    assert.ok(game.currentTrick instanceof Trick);
  });

  test('should handle playedCards correctly during initialization', () => {
    let game = new Game({
      distribution: {
        hands: [
          ['H8', 'HQ', 'HA', 'H7', 'CJ', 'CA', 'DA', 'DJ', 'H9', 'SJ'],
          ['D9', 'SA', 'C8', 'DK', 'C7', 'HK', 'SK', 'C10', 'D7', 'DQ'],
          ['S9', 'S8', 'CQ', 'H10', 'S7', 'CK', 'HJ', 'D10', 'S10', 'C9']
        ],
        skat: ['SQ', 'D8']
      },
      currentPlayer: 1,
      soloPlayer: 0,
      gameType: 'G',
      playedCards: ['HK', 'H10', 'HA', 'SJ']
    });

    assert(game.currentTrick.cards.some(c => c.suit === 'S' && c.figure === 'J'), 'SJ should be in the current trick');

    assert.strictEqual(game.currentPlayer, 1, 'Current player should be 1');
    assert.strictEqual(game.currentTrick.length, 1, 'Current trick should have 1 card');
    assert.strictEqual(game.playedTricks.length, 1, 'Played tricks should have 1 trick');
    assert.strictEqual(game.playedCardCount, 4, 'Played card count should be 4');
  });

  test('playCard should throw an error if the game is over', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.NULL,
      distribution: {
        hands: [],
        skat: []
      },
      playedTricks: Array(10)
    });

    assert.throws(() => {
      game.playCard({ suit: 'Hearts', figure: 'Ace' });
    }, /Cannot play card after game is over/);
  });

  test('undoLastMove should restore the last game state', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.GRAND,
      distribution: {
        hands: [[], [], []],
        skat: []
      },
      playedTricks: [],
      pointsSolo: 50,
      pointsDuo: 30,
      currentTrick: { leadPlayer: 0, cards: [{ suit: 'H', figure: 'A' }] }
    });

    const initialPointsSolo = game.pointsSolo;
    const initialPointsDuo = game.pointsDuo;

    game.undoLastMove();

    assert.strictEqual(game.pointsSolo, initialPointsSolo);
    assert.strictEqual(game.pointsDuo, initialPointsDuo);
    assert.strictEqual(game.currentTrick.cards.length, 0);
  });

  test('isOver should return true when all 10 tricks are played', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.NULL,
      distribution: {
        hands: [],
        skat: []
      },
      playedTricks: Array(10)
    });

    assert.strictEqual(game.isOver(), true);
  });

  test('isOver should return false when less than 10 tricks are played', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.NULL,
      distribution: {
        hands: [],
        skat: []
      },
      playedTricks: Array(5)
    });

    assert.strictEqual(game.isOver(), false);
  });

  test('soloHasMadeTrick should return true if solo player has won a trick', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.GRAND,
      distribution: {
        hands: [],
        skat: []
      },
      playedTricks: [
        { winningPlayer: 1, cards: [], value: 10 }
      ]
    });

    assert.strictEqual(game.soloHasMadeTrick, true);
  });

  test('duoHasMadeTrick should return true if duo players have won a trick', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.GRAND,
      distribution: {
        hands: [],
        skat: []
      },
      playedTricks: [
        { winningPlayer: 0, cards: [], value: 10 }
      ]
    });

    assert.strictEqual(game.duoHasMadeTrick, true);
  });

  test('clone should create an identical copy of the game state', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.GRAND,
      distribution: {
        hands: [],
        skat: []
      },
      playedTricks: [{ winningPlayer: 0, cards: [], value: 10 }],
      pointsSolo: 20,
      pointsDuo: 10
    });

    const clone = game.clone();

    assert.deepStrictEqual(clone, game);
    assert.notStrictEqual(clone, game); // Ensure they are not the same reference
  });

  test('toString should return a string representation of the game', () => {
    const game = new Game({
      soloPlayer: 1,
      currentPlayer: 0,
      gameType: GameType.GRAND,
      distribution: {
        hands: [],
        skat: []
      },
      pointsSolo: 20,
      pointsDuo: 10
    });

    const result = game.toString();

    assert.ok(result.includes('-----\nGame: Player 2 plays Grand'));
    assert.ok(result.includes('Score: 20:10'));
  });
});
