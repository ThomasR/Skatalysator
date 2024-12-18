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

const testCases = ['59', '57', '62', '62-optimal'];

test.describe('TrackingSkatalysatorSearch', () => {

  for (let fixtureName of testCases) {

    test.describe(`test fixture ${fixtureName}`, async () => {

      let {
        fixtures,
        game: imported
      } = await import(`../alphabeta-fixtures/fixture-${fixtureName}.mjs`);

      let game = imported.clone();

      const searcher = new TrackingSkatalysatorSearch({ game, logDepth: -1 });

      let playedCardCount = game.playedCardCount;
      for (const [move, expectedScore, expectedBest] of fixtures) {
        test(`Move ${++playedCardCount} [${move}]`, async (nested) => {
          game.playCard(move);
          if (game.isOver()) {
            return;
          }
          let evaluation = searcher.minimax();
          await nested.test('finds correct evaluation', () => {
            assert.equal(evaluation, expectedScore, 'Wrong evaluation');
          });
          await nested.test('finds best follow-up moves', () => {
            let bestMoves = searcher.bestMoves;
            assert.equal(bestMoves.length, expectedBest.length, 'Wrong number of best moves');
            for (let move of expectedBest) {
              assert(bestMoves.includes(new (Card(game.gameType))(move)), `bestMoves does not contain ${move}`);
            }
          });
        });
      }
    });
  }
});
