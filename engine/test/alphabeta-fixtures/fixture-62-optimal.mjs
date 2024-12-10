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

import { Game } from '../../model/Game.mjs';
import { GameType } from '../../model/GameType.mjs';

// https://dashboard.euroskat.com/listen/einsehen/9020350 10/18
// optimal branch of original game
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

game.playCard('DK');
game.playCard('DQ');
game.playCard('D8');

game.playCard('D9');
game.playCard('DA');
game.playCard('D7');

game.playCard('HJ');
game.playCard('H8');
game.playCard('H7');

game.playCard('H9');
game.playCard('HQ');
game.playCard('SJ');

// [move played, evaluation, best follow-up moves]
export const fixtures = [

  ['D10', 64, ['HK']],
  ['HK', 64, ['CJ']],
  ['CJ', 64, ['CK', 'C8', 'C7']],
  ['C8', 64, ['C9', 'CQ', 'CA']],
  ['C9', 64, ['HA', 'H10', 'DJ']],
  ['HA', 64, ['H10', 'DJ']],
  ['H10', 64, ['CK', 'C7']],
  ['C7', 64, ['CQ', 'CA']],
  ['CQ', 64, ['DJ']],
  ['DJ', 64, ['CK']],
  ['CK', 64, ['CA']],
  ['CA', 64]
];
