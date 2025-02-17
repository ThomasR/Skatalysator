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

import { baseText } from './template-minimalist.mjs';

export const text = baseText.replace('{suitColors}', `
    svg.diamonds .filled {
        fill: #C78800;
    }
    svg.diamonds .frame {
        stroke: #C78800;
    }
    svg.hearts .filled {
        fill: #d40000;
    }
    svg.hearts .frame {
        stroke: #d40000;
    }
    svg.spades .filled {
        fill: #0A8A2C;
    }
    svg.spades .frame {
        stroke: #0A8A2C;
    }
    svg.clubs .filled {
        fill: black;
    }
    svg.clubs .frame {
        stroke: black;
    }
`);

export { figures } from './template-tekeye.mjs';
export { demoPage } from './template-tekeye.mjs';
export { suitSymbolPaths } from './template-tekeye.mjs';
export { illustration } from './template-tekeye.mjs';
