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

import { text as parentText } from './template-emoji-base.mjs';

export const text = parentText.replace('{suitColors}', `
    svg.diamonds .filled,
    svg.hearts .filled {
        fill: hsl(0, 100%, 56%);
    }
    svg.spades .filled,
    svg.clubs .filled {
        fill: #000;
    }
`);

export { figures } from './template-emoji-base.mjs';
export { demoPage } from './template-emoji-base.mjs';
export { suitSymbolPaths } from './template-emoji-base.mjs';
export { illustration } from './template-emoji-base.mjs';
