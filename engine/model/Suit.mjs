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

export const Suit = {
  CLUBS: 'C',
  SPADES: 'S',
  HEARTS: 'H',
  DIAMONDS: 'D'
};

export const suitNames = {
  C: 'clubs',
  S: 'spades',
  H: 'hearts',
  D: 'diamonds'
};

export const suitLetters = Object.values(Suit);

let symbols = ['♣', '♠', '♥', '♦'];
if (globalThis.process?.stdout?.isTTY || globalThis.process?.env.FORCE_COLOR) {
  symbols = ['\x1b[34m♣\x1b[0m', '\x1b[32m♠\x1b[0m', '\x1b[31m♥\x1b[0m', '\x1b[33m♦\x1b[0m'];
}
export const suitSymbols = symbols;

export const suitToSymbol = suit => suitSymbols[suitLetters.indexOf(suit)];
