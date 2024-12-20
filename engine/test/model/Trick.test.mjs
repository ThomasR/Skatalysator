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

import test from 'node:test';
import assert from 'node:assert';
import { Trick } from '../../model/Trick.mjs';
import { GenericCard } from '../../model/GenericCard.mjs';
import { GameType } from '../../model/GameType.mjs';

test.describe('Trick', () => {

  test('should initialize with default values', () => {
    const trick = new Trick();
    assert.deepStrictEqual(trick.cards, []);
    assert.strictEqual(trick.leadPlayer, 0);
    assert.strictEqual(trick.winningPlayer, null);
  });

  test('should correctly assign values from constructor parameters', () => {
    const mockCard = new GenericCard('H10');
    const mockGameType = 'spades';
    const trick = new Trick({
      cards: [mockCard],
      leadPlayer: 1,
      winningPlayer: 2,
      gameType: mockGameType
    });

    assert.strictEqual(trick.cards.length, 1);
    assert.strictEqual(trick.leadPlayer, 1);
    assert.strictEqual(trick.winningPlayer, 2);
  });

  test('should add a card when playCard is called', () => {
    const trick = new Trick();
    const mockCard = new GenericCard('H10');

    trick.playCard(mockCard);

    assert.strictEqual(trick.cards.length, 1);
    assert.strictEqual(trick.cards[0], mockCard);
  });

  test('should throw an error when playCard is called with 3 or more cards already present', () => {
    const trick = new Trick({
      cards: ['H8', 'H9', 'H10']
    });
    const mockCard = new GenericCard('HJ');

    assert.throws(() => trick.playCard(mockCard), /Too many cards!/);
  });

  test('should calculate correct value for sum of card values', () => {
    const trick = new Trick({
      cards: ['H8', 'DQ', 'H10']
    });

    assert.strictEqual(trick.value, 13);
  });

  test('should resolve and return the winning player and score', () => {

    const mockGameType = GameType.SPADES;
    const trick = new Trick({
      cards: [
        'SQ',
        'D10',
        'DJ'
      ],
      leadPlayer: 0,
      gameType: mockGameType
    });

    const result = trick.resolve(mockGameType);

    assert.strictEqual(result.winningPlayer, 2);
    assert.strictEqual(result.score, 15);
    assert.strictEqual(trick.winningPlayer, 2);
  });

  test('should return the correct card for numeric getters', () => {
    const trick = new Trick({
      cards: ['SJ', 'DA']
    });

    assert.strictEqual(trick[0], new GenericCard('SJ'));
    assert.strictEqual(trick[1], new GenericCard('DA'));
  });

  test('should clone itself correctly', () => {
    const trick = new Trick({
      cards: ['DA', 'S9'],
      leadPlayer: 1,
      winningPlayer: 2
    });

    const clone = trick.clone();

    assert.notStrictEqual(clone, trick);
    assert.deepStrictEqual(clone.cards, trick.cards);
    assert.strictEqual(clone.leadPlayer, trick.leadPlayer);
    assert.strictEqual(clone.winningPlayer, trick.winningPlayer);
  });

  test('should generate correct string representation', () => {
    const trick = new Trick({
      cards: ['D9', 'C10']
    });

    assert.match(trick.toString(), /♦.*9 .*♣.*10/u);
  });

});
