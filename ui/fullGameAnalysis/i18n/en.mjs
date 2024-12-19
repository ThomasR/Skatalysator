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

export default {
  settings: {
    language: 'Language',
    alignCards: 'Align cards',
    trickWinnerMarker: 'Trick winner marker',
    none: 'None',
    star: 'Star',
    neon: 'Neon',
    cardTheme: 'Deck',
    background: 'Background:',
    reset: 'Reset',
    tournamentScheme: 'International suit colors'
  },
  analysis: {
    startButtonText: 'Run Analysis',
    endButtonText: 'Cancel Analysis',
    timeout: 'Timeout:',
    seconds: 'Seconds',
    tooltips: {
      domination: 'Player can play with open cards',
      forced: 'Only move',
      blunder: 'Blunder: {} -> {}',
      mistake: 'Mistake: {} -> {}',
      best: 'Best Move'
    }
  },
  info: {
    gameInfo: 'Player {} plays {}.',
    skatInfo: 'Dropped cards: {}'
  },
  legend: {
    forcedMove: 'Forced move',
    blunder: 'This is move losing the game or a multiplier. Hover over the symbol for details.',
    mistake: 'This move loses card points, but does not affect the outcome. Hover over the symbol for details.',
    bestMove: 'Best move',
    domination: 'The player can claim all remaining tricks, and therefore play with open cards.'
  },
  contracts: {
    C: '♣️Clubs',
    S: '♠️Spades',
    H: '♥️Hearts',
    D: '♦️Diamonds',
    G: 'Grand',
    0: 'Null'
  },
  cardLetters: {
    J: 'J',
    Q: 'Q',
    K: 'K'
  }
};
