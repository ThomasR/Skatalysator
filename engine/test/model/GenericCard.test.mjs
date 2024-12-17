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

import { GenericCard } from '../../model/GenericCard.mjs';

import assert from 'node:assert';
import test from 'node:test';
import { GameType } from '../../model/GameType.mjs';

test.describe('Card', () => {

  test('should create a valid card from suit and figure', () => {
    const card = new GenericCard({ suit: 'H', figure: 'Q' });
    assert.equal(card.suit, 'H');
    assert.equal(card.figure, 'Q');
  });

  test('should create a valid card from string input', () => {
    const card = new GenericCard('HQ');
    assert.equal(card.suit, 'H');
    assert.equal(card.figure, 'Q');
  });

  test('should throw an error for invalid card string', () => {
    assert.throws(() => new GenericCard('XZ'), /Invalid card "XZ"/);
  });

  test('should throw an error for invalid suit or figure in object input', () => {
    assert.throws(() => new GenericCard({ suit: 'Z', figure: '1' }));
  });

  test('should return correct rank for a card', () => {
    let card = new GenericCard('H9');
    assert.equal(card.rank, 2);
    card = new GenericCard('CJ');
    assert.equal(card.rank, 10);
  });

  test('should return correct suit index for a card', () => {
    const card = new GenericCard('HQ');
    assert.equal(card.suitIndex, 2);
  });

  test('should identify trump card when game type matches suit', () => {
    const card = new GenericCard('HQ');
    assert.equal(card.isTrump(GameType.HEARTS), true);
    assert.equal(card.isTrump(GameType.DIAMONDS), false);
  });

  test('should identify trump card for figure "J"', () => {
    const card = new GenericCard('SJ');
    assert.equal(card.isTrump('H'), true);
  });

  test('should not identify a card as trump in other game type', () => {
    const card = new GenericCard('HQ');
    assert.equal(card.isTrump(GameType.NULL), false);
  });

  test('should compare two cards for beatsCard in same suit', () => {
    const card1 = new GenericCard('HQ');
    const card2 = new GenericCard('H9');
    assert.equal(card1.beatsCard(card2, GameType.HEARTS), true);
  });

  test('should compare two cards for beatsCard when one is trump', () => {
    const card1 = new GenericCard('HQ');
    const card2 = new GenericCard('S9');
    assert.equal(card2.beatsCard(card1, GameType.SPADES), true);
  });

  test('toString should return correct string representation', () => {
    const card = new GenericCard('HQ');
    // eslint-disable-next-line no-control-regex
    let result = card.toString().replaceAll(/\x1b\[[0-9;]*m/g, '');
    assert.equal(result, '♥Q');
  });
});
