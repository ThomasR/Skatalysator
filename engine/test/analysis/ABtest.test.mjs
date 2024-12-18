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

import { LoggingSkatalysatorSearch as ABSearch } from '../../analysis/LoggingSkatalysatorSearch.mjs';

import test from 'node:test';
import assert from 'node:assert';

const testCases = ['59', '57', '62', '62-optimal'];

test.describe('ABSearch', () => {

  for (let fixtureName of testCases) {

    test.describe(`test fixture ${fixtureName}`, async () => {

      let { fixtures, game: imported } = await import(`../alphabeta-fixtures/fixture-${fixtureName}.mjs`);

      let game = imported.clone();

      const searcher = new ABSearch({ game, logDepth: -1 });

      let playedCardCount = game.playedCardCount;
      for (const [move, expected] of fixtures) {
        test(`Finds evaluation of move ${++playedCardCount} [${move}]`, () => {
          game.playCard(move);
          let evaluation = searcher.minimax();
          assert.equal(evaluation, expected, 'Wrong evaluation');
        });
      }
    });

  }
});
