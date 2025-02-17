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

import sample from '../sample.mjs';
import { suitNames } from '../../../engine/model/Suit.mjs';


const convertCard = card => ({
  suitName: suitNames[card.suit],
  name: card.figure
});

const convertTricks = tricks => tricks.map(trick => ({
  ...trick,
  cards: trick.cards.map(convertCard)
}));

document.addEventListener('alpine:init', () => {

  let rawGame;

  Alpine.store('game', {
    tricks: [],
    soloPlayer: 0,
    gameType: null,
    skat: [],

    getGame() {
      return rawGame;
    },

    setGame(game) {
      rawGame = game;
      let tricks = game.currentTrick?.length ?
        [...game.playedTricks, game.currentTrick] :
        game.playedTricks;
      this.tricks = convertTricks(tricks);
      this.soloPlayer = game.soloPlayer;
      this.gameType = game.gameType;
      this.skat = game.distribution.skat;
    }
  });

  Alpine.store('game').setGame(sample);
});
