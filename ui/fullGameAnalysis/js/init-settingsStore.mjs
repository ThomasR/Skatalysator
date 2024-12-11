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

  const storageKey = 'skatalysator-settings';

  Alpine.store('settings', {
    cardTheme: 'tekeye',
    trickMarker: 'none',
    alignCards: false,
    timeout: 60,
    bgColor: '#2170b0',

    init() {
      let settings = localStorage.getItem(storageKey);
      if (settings) {
        let parsed = JSON.parse(settings);
        let parsedKeys = Object.keys(parsed);
        let invalidKeys = parsedKeys.filter(key => typeof this[key] === 'undefined' || typeof this[key] === 'function');
        if (invalidKeys.length) {
          throw new Error(`Unknown config ${invalidKeys.join(', ')}`);
        }
        Object.assign(this, parsed);
      }

      let initialized = false;
      Alpine.effect(() => {
        let json = JSON.stringify(this);
        if (initialized) {
          localStorage.setItem(storageKey, json);
        }
        initialized = true;
      });
    }
  });
});
