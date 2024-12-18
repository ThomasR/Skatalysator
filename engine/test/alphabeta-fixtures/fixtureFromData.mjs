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


export default async function fixtureFromData({
  gameId,
  playedCardCount = 0
}) {

  const gameData = await dynamicImport(`./${gameId}.json`, { with: { type: 'json' } });
  let game = new Game(gameData.game);
  for (let i = 0; i < playedCardCount; i++) {
    let card = gameData.analysis[i + 1].move;
    game.playCard(card);
  }
  return {
    game,
    remaining: gameData.analysis.slice(playedCardCount),
    raw: gameData
  };
}
