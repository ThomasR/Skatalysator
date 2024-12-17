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
import { GameType } from '../../model/GameType.mjs';

// https://dashboard.euroskat.com/listen/einsehen/9020350 10/18
let distribution = {
  hands: [
    ['D9', 'DK', 'D10', 'H7', 'SJ', 'S10', 'SA', 'C9', 'CQ', 'CA'],
    ['DQ', 'DA', 'H9', 'HK', 'H10', 'HA', 'DJ', 'HJ', 'S8', 'S9'],
    ['D7', 'D8', 'H8', 'HQ', 'CJ', 'SQ', 'SK', 'C7', 'C8', 'CK']
  ],
  skat: ['C10', 'S7']
};

export const game = new Game({
  distribution,
  gameType: GameType.HEARTS,
  currentPlayer: 0,
  soloPlayer: 1
});

game.playCard('SA');
game.playCard('S8');
game.playCard('SK');

game.playCard('S10');
game.playCard('S9');
game.playCard('SQ');

export const fixtures = [
  ['DK', 64, ['DQ']],
  ['DA', 59, ['D7', 'D8']],
  ['D7', 59, ['HJ', 'DJ', 'DQ']],
  ['H9', 57, ['HQ', 'H8']],
  ['H8', 57, ['H7']],
  ['SJ', 62, ['H7', 'D10']],
  ['D10', 62, ['DQ']],
  ['DQ', 62, ['D8']],
  ['D8', 62, ['D9', 'C9', 'CQ', 'H7']],
  ['D9', 62, ['HJ', 'DJ', 'HA', 'H10', 'HK']],
  ['HK', 62, ['CK', 'C8', 'C7']],
  ['C7', 62, ['HJ', 'DJ', 'HA', 'H10']],
  ['DJ', 62, ['HQ']],
  ['HQ', 62, ['H7']],
  ['H7', 62, ['HJ']],
  ['HJ', 62, ['CJ']],
  ['CJ', 62, ['CA']],
  ['CA', 62, ['CK', 'C8']],
  ['C8', 62, ['CQ', 'C9']],
  ['CQ', 62, ['HA', 'H10']],
  ['H10', 62, ['HA']],
  ['HA', 62, ['CK']],
  ['CK', 62, ['C9']],
  ['C9', 62]
];
