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

document.addEventListener('alpine:init', () => {
  Alpine.store('game', {
    tricks: [{
      leadPlayer: 0,
      winningPlayer: 2,
      cards: [{ suit: 'diamonds', name: 'B' }, { suit: 'hearts', name: 'B' }, { suit: 'spades', name: 'B' }]
    }, {
      leadPlayer: 2,
      cards: [{ suit: 'clubs', name: 'K' }]
    }]
  });
});
