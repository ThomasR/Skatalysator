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

// https://dashboard.euroskat.com/listen/einsehen/9031171 05/09
let distribution = {
  hands: [
    ['D7', 'H7', 'H9', 'H10', 'SK', 'S10', 'C7', 'CK', 'C10', 'CA'],
    ['D9', 'DQ', 'D10', 'DA', 'HJ', 'S8', 'SQ', 'SA', 'C9', 'CJ'],
    ['D8', 'DK', 'DJ', 'HQ', 'HA', 'S7', 'S9', 'C8', 'CQ', 'SJ']
  ],
  skat: ['H8', 'HK']
};

export const game = new Game({
  distribution,
  gameType: GameType.DIAMONDS,
  currentPlayer: 2,
  soloPlayer: 1
});

// 1
game.playCard('CQ'); // 64
game.playCard('CA'); // == C10
game.playCard('C9');

// 2
game.playCard('D7');
game.playCard('HJ');
game.playCard('SJ');

// 3
game.playCard('C8'); // == HQ
game.playCard('CK');
game.playCard('DA'); // == D10 DQ

// 4
game.playCard('SA');
game.playCard('S7'); // == S9
game.playCard('SK');

// 5
game.playCard('S8');
game.playCard('S9');
game.playCard('S10');

// 6
game.playCard('C7'); // == H9 H7
game.playCard('DQ');
game.playCard('HQ');

// [move played, evaluation, best follow-up moves]
export const fixtures = [
  ['D9', 64, ['DK']],
  ['DK', 64, ['C10', 'H10']],
  ['C10', 64, ['HA']],
  ['HA', 64, ['H9', 'H7']],
  ['H9', 64, ['SQ']],
  ['SQ', 64, ['D8', 'DJ']],
  ['D8', 64, ['H10', 'H7']],
  ['H7', 64, ['D10']],
  ['D10', 64, ['CJ']],
  ['CJ', 64, ['DJ']],
  ['DJ', 64, ['H10']],
  ['H10', 64]
];
