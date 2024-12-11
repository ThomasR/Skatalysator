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

import sample from '../prototype/sample.mjs';
import analyzeGame from './analyzeGame.mjs';

document.addEventListener('alpine:init', () => {

  Alpine.bind('runAnalysis', () => {
    let store = Alpine.store('analysis');
    let { onStart, onResult, onEnd } = store;
    let stop = null;
    return {
      '@click'() {
        if (stop) {
          stop();
          stop = null;
        } else {
          stop = analyzeGame({
            game: sample,
            onStart: onStart.bind(store),
            onResult: onResult.bind(store),
            onEnd: onEnd.bind(store)
          });
        }
      }
    };
  });
});
