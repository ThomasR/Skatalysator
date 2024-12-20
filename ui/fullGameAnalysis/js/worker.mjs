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
import {
  TrackingSkatalysatorSearch
} from '../../../engine/analysis/TrackingSkatalysatorSearch.mjs';

const timeoutInSeconds = 60;

const checkTimeout = ({ startTime, timeout, analyzedTrickIndex, analyzedCardIndex }) => {
  if ((Date.now() - startTime) / 1_000 > timeout) {
    self.postMessage({
      type: 'timeout',
      payload: {
        analyzedTrickIndex,
        analyzedCardIndex
      }
    });
    self.close();
  }
};


const postResultMessage = ({
  score, bestMoves, scoreAfter, analyzedTrickIndex, analyzedCardIndex
}) => {

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
};

/** Events sent to the main thread:
 * - `start`: Sent before analyzing a specific trick and card.
 *            Payload Example:
 *            {
 *              type: 'start',
 *              payload: {
 *                analyzedTrickIndex: 3,
 *                analyzedCardIndex: 1
 *              }
 *            }
 *
 * - `result`: Sent after analyzing a game state to report the score and suggested best moves.
 *             It may also include additional fields if a significant change occurred.
 *             Payload Example:
 *             {
 *               type: 'result',
 *               payload: {
 *                 analyzedTrickIndex: 3,
 *                 analyzedCardIndex: 1,
 *                 best: {
 *                   score: 100,
 *                   bestMoves: ['DQ', 'CA']
 *                 },
 *                 forfeitScore: 80, // Optional; only included if different from `score`
 *                 isBlunder: true // Optional; indicates a potential mistake in strategy
 *               }
 *             }
 *
 * - `timeout`: Sent when the analysis exceeds the given timeout. The worker stops processing.
 *              Payload Example:
 *              {
 *                type: 'timeout',
 *                payload: {
 *                  analyzedTrickIndex: 3,
 *                  analyzedCardIndex: 1
 *                }
 *              }
 *
 * - `end`: Sent when the analysis process is complete.
 *          Payload Example:
 *          {
 *            type: 'end'
 *          }
 *
 * @event start  Indicates that analysis has started for a trick and a card.
 * @event result Contains the computed score and suggested best moves for the current position.
 * @event timeout Reports that the analysis exceeded the allowed timeout and was halted.
 * @event end    Signals the completion of the analysis process.
 */

const runAnalysis = ({ data: { game: gameData, skip = [], timeout = timeoutInSeconds } }) => {
  let startTime = Date.now();
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

    postResultMessage({ score, bestMoves, scoreAfter, analyzedTrickIndex, analyzedCardIndex });

    scoreAfter = score;

    checkTimeout({ startTime, timeout, analyzedTrickIndex, analyzedCardIndex });

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

/**
 * Handles messages received by the web worker to perform game analysis.
 * This function expects its input in the form of an object with specific properties.
 *
 * @param {Object} message - The input data object for analysis.
 * @param {Object} game - (Required) Serialized game data used to create a `Game` instance.
 *                        This object represents the current state of the game, including
 *                        played tricks, players’ moves, and the game board.
 *                        Example:
 *                        {
 *                          tricks: [],
 *                          currentTrick: ['card1', 'card2'],
 *                          score: 42,
 *                        }
 * @param {number[]} [skip=[]] - (Optional) An array of trick indices to skip during analysis.
 *                               If specified, the worker will not analyze these indices.
 *                               Example: [0, 2, 5] (skips tricks at positions 0, 2, and 5).
 * @param {number} [timeout=60] - (Optional) The timeout for analysis in seconds. If
 *                                 exceeded, the worker will send a timeout notification and
 *                                 terminate execution. Default is 60 seconds.
 */

self.onmessage = runAnalysis;
