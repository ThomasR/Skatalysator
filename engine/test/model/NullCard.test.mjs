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
import { NullCard } from '../../model/NullCard.mjs';
import { GameType } from '../../model/GameType.mjs';

test.describe('NullCard', () => {
  test('should return 0 as the value of the card', () => {
    const nullCard = new NullCard('D10');
    assert.strictEqual(nullCard.value, 0);
  });

  test('should calculate rank', () => {
    const nullCard = new NullCard('DJ');
    assert.equal(nullCard.rank, 4);
  });

  test('should compare cards correctly', () => {
    const nullCard = new NullCard('DK');
    assert(nullCard.beatsCard(new NullCard('DJ'), GameType.NULL));
  });
});
