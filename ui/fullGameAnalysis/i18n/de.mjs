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
    language: 'Sprache',
    alignCards: 'Karten ausrichten',
    trickWinnerMarker: 'Markierung des Stichgewinners',
    none: 'ohne',
    star: 'Stern',
    neon: 'Neon',
    cardTheme: 'Karten',
    background: 'Hintergrund:',
    reset: 'Zurücksetzen',
    tournamentScheme: 'Turnierfarben'
  },
  analysis: {
    startButtonText: 'Analyse starten',
    endButtonText: 'Analyse stoppen',
    timeout: 'Timeout:',
    seconds: 'Sekunden',
    tooltips: {
      domination: 'Spieler kann offenlegen',
      forced: 'Einzig möglicher Zug',
      blunder: 'Fehler: {} -> {}',
      mistake: 'Ungenauigkeit: {} -> {}',
      best: 'Bester Zug'
    }
  },
  info: {
    gameInfo: 'Spieler {} spielt {}.',
    skatInfo: 'Gedrückt: {}'
  },
  legend: {
    forcedMove: 'Erzwungener Zug',
    blunder: 'Dieser Zug verliert das Spiel oder eine Gewinnstufe. Für Details mit der Maus über das Symbol fahren.',
    mistake: 'Dieser Zug verliert Augen, aber bei gleicher Gewinnstufe. Für Details mit der Maus über das Symbol fahren.',
    bestMove: 'Bester Zug',
    domination: 'An dieser Stelle macht der Spieler alle restlichen Stiche, und kann hinlegen'
  },
  contracts: {
    C: '♣️Kreuz',
    S: '♠️Pik',
    H: '♥️Herz',
    D: '♦️Karo',
    G: 'Grand',
    0: 'Null'
  },
  cardLetters: {
    J: 'B',
    Q: 'D',
    K: 'K',
    A: 'A'
  }
};
