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

import { Game } from '../../../engine/model/Game.mjs';
import { GameType } from '../../../engine/model/GameType.mjs';

let distribution = {
  hands: [
    ['D7', 'SJ', 'H7', 'HQ', 'HK', 'S8', 'SK', 'SA', 'C8', 'CK'],
    ['DJ', 'DK', 'D9', 'C10', 'CQ', 'C9', 'C7', 'S9', 'S10', 'H10'],
    ['CJ', 'HJ', 'DA', 'D10', 'DQ', 'D8', 'CA', 'H8', 'HA', 'H9']
  ],
  skat: ['S7', 'SQ']
};

const game = new Game({
  distribution,
  gameType: GameType.DIAMONDS,
  currentPlayer: 1,
  soloPlayer: 2
});

// 1
game.playCard('C9');
game.playCard('CA');
game.playCard('C8');

// 2
game.playCard('CJ');
game.playCard('D7');
game.playCard('D9');

// 3
game.playCard('HJ');
game.playCard('SJ');
game.playCard('DK');

// 4
game.playCard('HQ');
game.playCard('H10');
game.playCard('HA');

// 5
game.playCard('D8');
game.playCard('HK');
game.playCard('DJ');

// 6
game.playCard('C10');
game.playCard('DQ');
game.playCard('CK');

// 7
game.playCard('DA');

export { game as default };
