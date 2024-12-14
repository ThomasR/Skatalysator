/*
 * Copyright 2024 Thomas Rosenau
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
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
import { CardDistribution } from '../../model/CardDistribution.mjs';
import { GameType } from '../../model/GameType.mjs';
import { GenericCard } from '../../model/GenericCard.mjs';

test.describe('CardDistribution', () => {
  test('should throw an error if gameType is not provided', () => {
    assert.throws(
      () => new CardDistribution({ hands: [], skat: [] }),
      new Error('gameType is required')
    );
  });

  test('should correctly initialize hands and skat on valid input', () => {
    const mockInput = {
      hands: [
        ['CQ', 'DQ'],
        ['CJ', 'HJ'],
        ['SA', 'S7']
      ],
      skat: ['S9', 'S8']
    };

    const cardDistribution = new CardDistribution(mockInput, GameType.SPADES);

    assert.equal(cardDistribution.hands.length, 3);
    assert.equal(cardDistribution.hands[0].gameType, GameType.SPADES);
    assert.equal(cardDistribution.skat.length, 2);
  });

  test('should clone an existing distribution correctly', () => {
    const mockInput = {
      hands: [
        ['CQ', 'DQ'],
        ['CJ', 'HJ'],
        ['SA', 'S7']
      ],
      skat: ['S9', 'S8']
    };

    const cardDistribution = new CardDistribution(mockInput, GameType.SPADES);

    const clonedDistribution = cardDistribution.clone();

    assert.deepStrictEqual(clonedDistribution.hands[0].cards, cardDistribution.hands[0].cards);
    assert.notStrictEqual(clonedDistribution.hands[0], cardDistribution.hands[0]);
  });

  test('should add a card to the specified player hand', () => {
    const mockInput = {
      hands: [
        ['CQ', 'DQ'],
        ['CJ', 'HJ'],
        ['SA', 'S7']
      ],
      skat: ['S9', 'S8']
    };

    const cardDistribution = new CardDistribution(mockInput, GameType.SPADES);
    const mockCard = new GenericCard('D10');

    cardDistribution.addCard(mockCard, 1);
    assert.strictEqual(cardDistribution.hands[1].cards.D[0], mockCard);
  });

  test('should throw an error if adding a duplicate card to a player hand', () => {
    const mockInput = {
      hands: [
        ['CQ', 'DQ'],
        ['CJ', 'HJ'],
        ['SA', 'S7']
      ],
      skat: ['S9', 'S8']
    };

    const cardDistribution = new CardDistribution(mockInput, GameType.SPADES);
    const mockCard = new GenericCard('HJ');

    assert.throws(
      () => cardDistribution.addCard(mockCard, 1),
      /Player 2 already has card/
    );
  });

  test('should remove a card from the specified player hand', () => {
    const mockInput = {
      hands: [
        ['CQ', 'DQ'],
        ['CJ', 'HJ'],
        ['SA', 'S7']
      ],
      skat: ['S9', 'S8']
    };

    const cardDistribution = new CardDistribution(mockInput, GameType.SPADES);

    cardDistribution.removeCard(new GenericCard('HJ'), 1);
    assert.strictEqual(cardDistribution.hands[1].allCards.length, 1);
  });

  test('should throw an error if removing a card not owned by a player', () => {
    class MockHand {
      // eslint-disable-next-line class-methods-use-this
      addCard() {
      }

      // eslint-disable-next-line class-methods-use-this
      removeCard() {
        throw new Error('not owned');
      }
    }

    const input = {
      hands: [new MockHand(), new MockHand(), new MockHand()],
      skat: []
    };
    const gameType = 'mockGame';

    const cardDistribution = new CardDistribution(input, gameType);
    const mockCard = 'mockCard';

    assert.throws(
      () => cardDistribution.removeCard(mockCard, 1),
      /Player 2 does not have mockCard!/
    );
  });

  test('should return a correct string representation of the card distribution', () => {
    const mockInput = {
      hands: [
        ['CQ', 'DQ'],
        ['CJ', 'HJ'],
        ['SA', 'S7']
      ],
      skat: ['S9', 'S8']
    };

    const cardDistribution = new CardDistribution(mockInput, GameType.SPADES);

    const result = cardDistribution.toString();

    assert.strictEqual(
      result,
      'Pl.1: \x1B[34m♣\x1B[0mQ \x1B[33m♦\x1B[0mQ\nPl.2: \x1B[34m♣\x1B[0mJ \x1B[31m♥\x1B[0mJ\nPl.3:' +
      ' \x1B[32m♠\x1B[0mA \x1B[32m♠\x1B[0m7\nSkat: \x1B[32m♠\x1B[0m9 \x1B[32m♠\x1B[0m8'
    );
  });
});
