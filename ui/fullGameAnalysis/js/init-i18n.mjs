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

import { translate } from './i18n.mjs';

/**
 * Simple i18n implementation.
 * Usage:
 *
 *  $t('some.string')
 *
 * If your dictionary contains
 * {
 *   some: {
 *     string: 'foo'
 *   }
 * }
 *
 * this will evaluate to "foo".
 *
 * Placeholders are supported:
 *
 * {
 *   some: {
 *     string: 'foo has {} apples and {} oranges'
 *   }
 * }
 *
 * $t('some.string', 3, 'no') // -> 'foo has 3 apples and no oranges'
 *
 * The current locale from the 'settings' store is used to pick the dictionary.
 */
document.addEventListener('alpine:init', () => {
  let settings;
  Alpine.magic('t', el => {
    if (!settings) {
      settings = Alpine.store('settings');
    }
    return translate({ el, locale: settings.locale });
  });
});
