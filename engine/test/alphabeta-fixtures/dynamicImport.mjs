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

let dynamicImport;

if (globalThis.process?.versions.node) {
  const [{ readFile }, path, { fileURLToPath }] = await Promise.all([
    import('node:fs/promises'),
    import('node:path'),
    import('url')
  ]);

  dynamicImport = function (relativePath, {
    basePath = fileURLToPath(import.meta.url),
    with: { type = 'text' } = {}
  } = {}) {

    let result = readFile(path.join(path.dirname(basePath), relativePath), 'utf8');
    if (type === 'json') {
      return result.then(text => JSON.parse(text));
    } else if (type === 'text') {
      return result;
    } else {
      throw new Error(`Unknown import type ${type}`);
    }
  };
} else {
  dynamicImport = function (relativePath, { basePath = import.meta.url, with: { type = 'text' } = {} }) {
    let result = fetch(new URL(relativePath, basePath));
    if (type === 'json') {
      return result.then((response) => response.json());
    } else if (type === 'text') {
      return result.then((response) => response.text());
    } else {
      throw new Error(`Unknown import type ${type}`);
    }
  };
}

export default dynamicImport;
