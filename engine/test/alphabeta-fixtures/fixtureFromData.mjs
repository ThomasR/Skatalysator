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

import { Game } from '../../model/Game.mjs';
import dynamicImport from './dynamicImport.mjs';


export default async function fixtureFromData({ seriesId, gameIndex, playedCardCount = 0, includeEvaluation = true }) {

  const json = await dynamicImport(`./games/${seriesId}.json`, { with: { type: 'json' } });
  let gameData = json[gameIndex - 1];
  let game = new Game(gameData.game);
  for (let i = 0; i < playedCardCount; i++) {
    game.playCard(gameData.playedCards[i]);
  }
  let result = { game };
  if (includeEvaluation) {
    result.evaluation = await dynamicImport(`./evaluations/${seriesId}-${gameIndex}.json`, { with: { type: 'json' } });
  }
  return result;
}
