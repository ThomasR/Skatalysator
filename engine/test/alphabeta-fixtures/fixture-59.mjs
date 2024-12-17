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

import { Game } from '../../model/Game.mjs';

export const game = new Game({
  distribution: {
    hands: [
      ['HK', 'HQ', 'S7', 'S9', 'CJ', 'S10', 'SQ', 'SJ', 'HJ', 'H7'],
      ['C7', 'DJ', 'DK', 'D8', 'H9', 'SA', 'CQ', 'D7', 'C9', 'HA'],
      ['S8', 'CA', 'SK', 'CK', 'H8', 'C8', 'D9', 'H10', 'DQ', 'DA']
    ],
    skat: ['D10', 'C10']
  },
  soloPlayer: 0,
  gameType: -1,
  currentPlayer: 1
});


// 1
game.playCard('SA');
game.playCard('SK');
game.playCard('S7');

// 2
game.playCard('C7');
game.playCard('CA');
game.playCard('HJ');

// 3
game.playCard('SJ');

// [move played, evaluation, best follow-up moves]
export const fixtures = [
  ['DJ', 59, ['H8']],
  ['S8', 66, ['HK', 'HQ', 'H7']],
  ['HQ', 66, ['H9', 'HA']],
  ['H9', 66, ['H10']],
  ['H10', 66, ['DA']],
  ['CK', 67, ['H7', 'HK']],
  ['H7', 67, ['CQ']],
  ['CQ', 67, ['DA']],
  ['C8', 81, ['HK']],
  ['CJ', 59, ['C9']],
  ['C9', 59, ['S10', 'SQ', 'S9']],
  ['S10', 59, ['D7', 'D8', 'DK']],
  ['D7', 59, ['H8', 'DQ', 'D9']],
  ['H8', 59, ['SQ', 'S9']],
  ['SQ', 59, ['D8', 'DK']],
  ['DK', 59, ['D9', 'DQ']],
  ['D9', 59, ['S9']],
  ['S9', 59, ['D8']],
  ['D8', 59, ['DQ']],
  ['DQ', 59, ['HK']],
  ['HK', 59, ['HA']],
  ['HA', 59, ['DA']],
  ['DA', 59]
];
