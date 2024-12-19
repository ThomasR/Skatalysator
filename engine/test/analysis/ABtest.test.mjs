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

import {
  LoggingSkatalysatorSearch as ABSearch
} from '../../analysis/LoggingSkatalysatorSearch.mjs';

import test from 'node:test';
import assert from 'node:assert';

import fixtureFromData from '../alphabeta-fixtures/fixtureFromData.mjs';

const testCases = [
  { gameId: '9042180-7', playedCardCount: 5 }, // best case
  { gameId: '9020350-10', playedCardCount: 6 },
  { gameId: '8953165-28', playedCardCount: 6 },
  { gameId: '9031171-5', playedCardCount: 10 },
  { gameId: '8953165-27', playedCardCount: 10 },
  { gameId: '8953165-18', playedCardCount: 11 } // worst case by far

];

test.describe('ABSearch', () => {

  for (let { gameId, playedCardCount } of testCases) {

    test.describe(`Game ${gameId}`, async () => {

      let { game, remaining } = await fixtureFromData({ gameId, playedCardCount });

      const searcher = new ABSearch({ game, logDepth: -1 });

      for (const { move, evaluation: expected } of remaining.slice(1)) {
        if (expected) {
          test(`Finds evaluation of move ${++playedCardCount} [${move}]`, () => {
            game.playCard(move);
            let actual = searcher.minimax();
            assert.strictEqual(actual, expected.score, `Wrong evaluation: ${actual} != ${expected}`);
          });
        }
      }
    });
  }
});
