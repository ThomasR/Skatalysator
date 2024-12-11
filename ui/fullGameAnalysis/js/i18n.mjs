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

import { default as de } from '../i18n/de.mjs';
import { default as en } from '../i18n/en.mjs';

export const dictionary = {
  de,
  en
};

export const translate = ({ locale }) => (key, ...params) => {
  let target = key.split('.').reduce(
    (result, path) => result?.[path] || '',
    dictionary[locale]
  );

  let i = 0;
  return target.replaceAll(/{}/g, () => params[i++] ?? '');
};
