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

import test from 'node:test';
import assert from 'node:assert';
import { GameHasher } from '../../analysis/GameHasher.mjs';
import { GameType } from '../../model/GameType.mjs';
import { Game } from '../../model/Game.mjs';


test.describe('GameHasher', () => {
  test('hash should return correct hash for NULL game without tricks', () => {
    const game = new Game({
      gameType: GameType.NULL,
      pointsSolo: 0,
      distribution: {
        hands: [
          ['D7', 'DA'],
          ['H7', 'H9'],
          ['CJ', 'H8']
        ],
        skat: ['DJ']
      },
      currentTrick: null,
      currentPlayer: 1
    });

    const expectedHash = '1,129,1280,268435968';

    const result = GameHasher.hash(game);

    assert.strictEqual(result, expectedHash);
  });

  test('hash should include current trick cards and score when present', () => {
    const game = new Game({
      gameType: GameType.SPADES,
      pointsSolo: 15,
      distribution: {
        hands: [
          ['D7', 'DA', 'C9', 'HJ'],
          ['H7', 'H9', 'C8'],
          ['CJ', 'H8', 'S8']
        ],
        skat: []
      },
      currentPlayer: 2,
      currentTrick: {
        cards: [{ figure: 'A', suit: 'H' }, { figure: 'K', suit: 'S' }]
      }
    });

    const expectedHash = '2,15,272629825,2097792,536887552,HA,SK';

    const result = GameHasher.hash(game);

    assert.strictEqual(result, expectedHash);
  });

  test('nullHandToHash correctly returns hash for a given hand', () => {
    const game = new Game({
      gameType: GameType.NULL,
      distribution: {
        hands: [
          ['D7', 'DA', 'C9', 'HJ'],
          ['H7', 'H9', 'C8'],
          ['CJ', 'H8', 'S8']
        ],
        skat: []
      },
      currentPlayer: 0,
      currentTrick: {
        cards: [{ figure: 'A', suit: 'H' }, { figure: 'K', suit: 'S' }]
      }
    });

    const expectedHash = '0,67113089,33555712,268567040,HA,SK';

    const result = GameHasher.hash(game);

    assert.strictEqual(result, expectedHash);
  });

});
