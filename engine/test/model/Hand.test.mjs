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

import assert from 'node:assert';
import test from 'node:test';
import { Hand } from '../../model/Hand.mjs';
import { GameType } from '../../model/GameType.mjs';
import { GenericCard } from '../../model/GenericCard.mjs';

test.describe('Hand', () => {
  test('Constructor throws error when gameType is not provided', () => {
    assert.throws(() => new Hand([], undefined), /Must pass gameType/);
  });

  test('Constructor initializes correctly with proper input and gameType', () => {
    const hand = new Hand(['H10', 'H9'], GameType.HEARTS);
    assert.equal(hand.gameType, GameType.HEARTS);
    assert.equal(hand.cards.H.length, 2);
  });

  test('Trump cards return correctly for DIAMONDS gameType', () => {
    const hand = new Hand(['HJ', 'CJ', 'DA', 'SA'], GameType.DIAMONDS);
    const trumps = hand.trumpCards;
    assert.equal(trumps.length, 3);
  });

  test('Trump cards return correctly for DIAMONDS gameType', () => {
    const hand = new Hand(['HJ', 'CJ', 'DA', 'SA'], GameType.DIAMONDS);
    const trumps = hand.trumpCards;
    assert.equal(trumps.length, 3);
  });

  test('Trump cards return correctly for NULL gameType', () => {
    const hand = new Hand(['HJ', 'CJ', 'DA', 'SA'], GameType.NULL);
    const trumps = hand.trumpCards;
    assert.equal(trumps.length, 0);
  });

  test('allCards returns all cards in hand', () => {
    const hand = new Hand(['H10', 'H9', 'DJ'], GameType.HEARTS);
    const allCards = hand.allCards;
    assert.equal(allCards.length, 3);
  });

  test('hasTrumps returns true if there are trump cards', () => {
    const hand = new Hand(['H10', 'HJ'], GameType.HEARTS);
    assert.equal(hand.hasTrumps, true);
  });

  test('addCard inserts a card into the correct position', () => {
    const hand = new Hand(['S10', 'SQ'], GameType.HEARTS);
    hand.addCard(new GenericCard('SK'));
    assert.equal(hand.cards.S.length, 3);
    assert.equal(hand.cards.S[1].figure, 'K');
  });

  test('Does not add card if already in hand', () => {
    const hand = new Hand(['S10'], GameType.HEARTS);
    assert.throws(() => hand.addCard(new GenericCard('S10')), /Player already has/);
  });

  test('removeCard removes the specified card', () => {
    const hand = new Hand(['DA', 'D10', 'D9'], GameType.HEARTS);
    hand.removeCard(new GenericCard('D10'));
    assert.equal(hand.cards.D.length, 2);
    assert.equal(hand.cards.D[1], new GenericCard('D9'));
  });

  test('removeCard throws error if card is not in the hand', () => {
    const hand = new Hand(['D10', 'D9'], GameType.GRAND);
    assert.throws(() => hand.removeCard(new GenericCard('DK')), /Player does not have/);
  });

  test('toString returns string representation of the hand', () => {
    const hand = new Hand(['C10', 'C9'], GameType.GRAND);
    assert.match(hand.toString(), /♣.*10 .*♣.*9/);
  });

  test('toHash computes a unique hash for the hand', () => {
    const hand1 = new Hand(['H10'], GameType.GRAND);
    const hand2 = new Hand(['H10', 'H9'], GameType.GRAND);
    assert.notEqual(hand1.toHash(), hand2.toHash());
  });

  test('clone creates an identical copy of the hand', () => {
    const hand1 = new Hand(['D10', 'D9'], GameType.GRAND);
    const hand2 = hand1.clone();
    assert.notEqual(hand1, hand2);
    assert.equal(hand1.toString(), hand2.toString());
    assert.equal(hand1.toHash(), hand2.toHash());
    assert.equal(hand1.gameType, hand2.gameType);
  });
});
