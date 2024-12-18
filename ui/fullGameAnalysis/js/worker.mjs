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

import { Game } from '../../../engine/model/Game.mjs';
import { WinLevel } from '../../../engine/model/WinLevel.mjs';
import { TrackingSkatalysatorSearch } from '../../../engine/analysis/TrackingSkatalysatorSearch.mjs';

const timeoutInSeconds = 60;

const runAnalysis = ({ data: { game: gameData, skip = [], timeout = timeoutInSeconds } }) => {
  let time = Date.now();
  let game = new Game(gameData);
  let scoreAfter = null;

  let scorer = new TrackingSkatalysatorSearch({ game });

  let cardCount = game.playedCardCount;
  for (let i = 0; i <= cardCount; i++) {
    if (skip.includes(i) || game.isOver()) {
      game.undoLastMove();
      continue;
    }
    let analyzedTrickIndex = game.playedTricks.length;
    let analyzedCardIndex = game.currentTrick.length;
    self.postMessage({
      type: 'start',
      payload: {
        analyzedTrickIndex,
        analyzedCardIndex
      }
    });

    let score = scorer.minimax();
    let bestMoves = scorer.bestMoves;

    let message = {
      type: 'result',
      payload: {
        analyzedTrickIndex,
        analyzedCardIndex,
        best: {
          score,
          bestMoves
        }
      }
    };

    if (scoreAfter !== null && scoreAfter !== score) {
      message.payload.forfeitScore = scoreAfter;
      message.payload.isBlunder = WinLevel.getLevel(score) !== WinLevel.getLevel(scoreAfter);
    }

    self.postMessage(message);

    scoreAfter = score;

    if ((Date.now() - time) / 1_000 > timeout) {
      self.postMessage({
        type: 'timeout',
        payload: {
          analyzedTrickIndex,
          analyzedCardIndex
        }
      });
      self.close();
    }

    try {
      game.undoLastMove();
    } catch {
      return;
    }
  }

  self.postMessage({
    type: 'end'
  });
};

// TODO: document arg format
self.onmessage = runAnalysis;
