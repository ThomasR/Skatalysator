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

import { TrackingSkatalysatorSearch } from '../../analysis/TrackingSkatalysatorSearch.mjs';
import { Card } from '../../model/Card.mjs';

import fixtureFromData from '../alphabeta-fixtures/fixtureFromData.mjs';

const testCases = [
  // best case
  { gameId: '9042180-7', playedCardCount: 5 },

  { gameId: '9020350-10', playedCardCount: 6 },
  { gameId: '8953165-28', playedCardCount: 6 },
  { gameId: '9031171-5', playedCardCount: 10 },
  { gameId: '8953165-27', playedCardCount: 11 },

  // absolute worst case
  { gameId: '8953165-18', playedCardCount: 11 }

];

test.describe('TrackingSkatalysatorSearch', () => {

  for (let { gameId, playedCardCount } of testCases) {

    test.describe(`Game ${gameId}`, async () => {

      let { game, remaining } = await fixtureFromData({ gameId, playedCardCount });

      const searcher = new TrackingSkatalysatorSearch({ game, logDepth: -1 });

      for (const { move, evaluation: expected } of remaining.slice(1)) {
        if (expected) {
          test(`Move ${++playedCardCount} [${move}]`, async (nested) => {
            game.playCard(move);
            let actual = searcher.minimax();
            await nested.test('finds correct evaluation', () => {
              assert.strictEqual(actual, expected.score, `Wrong evaluation: ${actual} != ${expected}`);
            });
            await nested.test('finds best follow-up moves', () => {
              let bestMoves = searcher.bestMoves;
              assert.equal(bestMoves.length, expected.best.length, 'Wrong number of best moves');
              for (let move of expected.best) {
                assert(bestMoves.includes(new (Card(game.gameType))(move)), `bestMoves does not contain ${move}`);
              }
            });
          });
        }
      }
    });
  }
});
