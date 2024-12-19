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

import test, { before, after } from 'node:test';
import assert from 'node:assert';

let translate;

test.describe('translate function', () => {

  let enMock, deMock;

  before(async () => {
    global.location = { hostname: 'dummy.com' };
    enMock = test.mock.module('../i18n/en.mjs', {
      defaultExport: {
        greeting: 'Hello, {}!',
        nested: {
          translation: {
            key: 'Goodbye!'
          }
        }
      }
    });
    deMock = test.mock.module('../i18n/de.mjs', {
      defaultExport: {
        greeting: 'Guten Tag, {}!'
      }
    });
    const i18n = await import('../js/i18n.mjs');
    translate = i18n.translate;
  });

  after(() => {
    delete global.location;
    enMock.restore();
    deMock.restore();
  });

  test('should return the translated string for the given locale', () => {
    const t = translate({ locale: 'en' });
    const result = t('greeting', 'John');
    assert.strictEqual(result, 'Hello, John!');
  });

  test('should handle nested keys', () => {
    const t = translate({ locale: 'en' });
    const result = t('nested.translation.key');
    assert.strictEqual(result, 'Goodbye!');
  });

  test('should return the correct translation for a different locale', () => {
    const t = translate({ locale: 'de' });
    const result = t('greeting', 'Peter');
    assert.strictEqual(result, 'Guten Tag, Peter!');
  });

  test('should handle missing translations in development mode', () => {
    const originalHostname = global.location.hostname;
    global.location.hostname = 'localhost';

    const t = translate({ locale: 'en' });
    const result = t('nonexistent.key');
    assert.strictEqual(result, 'MISSING TRANSLATION: nonexistent.key (WILL BE EMPTY IN PRODUCTION)');

    global.location.hostname = originalHostname;
  });

  test('should handle missing translations in production mode', () => {
    const t = translate({ locale: 'en' });
    const result = t('nonexistent.key');
    assert.strictEqual(result, '');
  });

});
