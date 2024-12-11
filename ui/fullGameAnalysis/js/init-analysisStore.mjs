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
  Alpine.store('analysis', {
    running: false,

    cardEvaluation: [],

    init() {
      this.cardEvaluation = Array(10).fill(0).map(() => [null, null, null]);
    },

    onStart(result) {
      const { analyzedTrickIndex, analyzedCardIndex } = result;
      this.cardEvaluation[analyzedTrickIndex][analyzedCardIndex] = { css: 'analyzing' };
      this.running = true;
    },

    onResult(result) {
      const { analyzedTrickIndex, analyzedCardIndex, best, forced, forfeitScore, isBlunder } = result;
      let css = '';
      if (forced) {
        css = 'forced';
      } else if (best.hint === 'domination') {
        css = 'domination';
      } else if (forfeitScore) {
        css = isBlunder ? 'blunder' : 'mistake';
      } else {
        css = 'best';
      }
      this.cardEvaluation[analyzedTrickIndex][analyzedCardIndex] = {
        ...result,
        css
      };
    },

    onEnd() {
      for (let trick of this.cardEvaluation) {
        for (let card of trick) {
          if (card?.css === 'analyzing') {
            card.css = null;
          }
        }
      }
      this.running = false;
    }
  });
});
