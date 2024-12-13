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

import assert from 'node:assert';
import { default as test, suite } from 'node:test';

import { Card } from '../../model/Card.mjs';

import { SkatalysatorAlphaBetaSearch } from '../../analysis/SkatalysatorAlphaBetaSearch.mjs';
import { LoggingSkatalysatorAlphaBetaSearch } from '../../analysis/LoggingSkatalysatorAlphaBetaSearch.mjs';
import { CachingSkatalysatorAlphaBetaSearch } from '../../analysis/CachingSkatalysatorAlphaBetaSearch.mjs';

const testCases = ['57', '62', '62-optimal', '59'];

for (let AlphaBeta of [SkatalysatorAlphaBetaSearch, LoggingSkatalysatorAlphaBetaSearch, CachingSkatalysatorAlphaBetaSearch]) {
  suite(AlphaBeta.name, () => {

    for (const id of testCases) {
      suite(`Game ${id}`, async () => {
        const { fixtures, game: originalGame } = await import(`../alphabeta-fixtures/fixture-${id}.mjs`);
        let game = originalGame.clone();
        let moveNumber = 3 * game.playedTricks.length + game.currentTrick.length + 1;
        for (let [cardToPlay, score, bestContinuation = [undefined]] of fixtures) {
          test(`Move ${moveNumber++} - ${cardToPlay}`, () => {
            game.playCard(cardToPlay);
            let evaluation = new AlphaBeta({ game: game.clone() }).minimax();
            if (!evaluation.moves?.length) {
              if (game.playedTricks.length < 10) {
                assert.equal(evaluation.hint, 'domination', 'Evaluation should include follow-up moves or domination hint');
              }
            } else {
              let expectedCards = bestContinuation.map(x => (x ? new (Card(game.gameType))(x) : undefined));
              assert(expectedCards.includes(evaluation.moves[0]),
                `Best move ${evaluation.moves[0]} should be ${expectedCards.length > 1 ?
                  'one of ' :
                  ''}${expectedCards}`);
            }
            assert.equal(evaluation.score, score);
          });
        }
      });
    }
  });
}
