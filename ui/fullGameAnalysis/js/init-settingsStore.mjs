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

  const defaults = {
    cardTheme: 'emoji-tournament',
    trickWinnerMarker: 'none',
    alignCards: false,
    timeout: 60,
    bgColor: '#0e5d9a'
  };

  let initialized = false;
  Alpine.store('settings', {
    ...defaults,
    locale: 'de',

    init() {
      this.loadFromStorage();

      Alpine.effect(() => {
        if (!initialized) {
          // JSON.stringify will access every property, thus activating reactivity through the synthesized getter
          JSON.stringify(this);
          initialized = true;
          return;
        }
        this.saveToStorage();
      });
    },

    saveToStorage() {
      localStorage.setItem(storageKey, JSON.stringify(this));
    },

    loadFromStorage() {
      let settings = localStorage.getItem(storageKey);
      if (settings) {
        let parsed = JSON.parse(settings);
        let parsedKeys = Object.keys(parsed);
        let invalidKeys = parsedKeys.filter(key => typeof this[key] === 'undefined' || typeof this[key] === 'function');
        if (invalidKeys.length) {
          // eslint-disable-next-line no-console
          console.warn(`Unknown config ${invalidKeys.join(', ')}`);
          invalidKeys.forEach(key => delete parsed[key]);
        }
        Object.assign(this, parsed);
      }
    },

    reset() {
      Object.assign(this, defaults);
    }
  });
});
