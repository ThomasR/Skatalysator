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

/*
* Simple template processor.
* Uses placeholder syntax {placeholder}
* Specials:
* - conditionals
*   {?someName} … {/someName}
* - Mathematical expressions
*   {= 3/2}
*   {={x}/{y}+{z}}
*   These can only contain (after placeholder evaluation) the characters +-*0123456789/.()[] and spaces.
*   The [] brackets stand for Math.round, so [3.6] == 4
*/

export const processTemplate = (templateText, args) => {
  let processedText = templateText;
  let replacementRegEx;
  Object.entries(args).forEach(([key, val]) => {
    if (typeof val === 'boolean') {
      if (val) {
        replacementRegEx = new RegExp(`\\{[?/]${key}}`, 'g');
      } else {
        replacementRegEx = new RegExp(`\\{\\?${key}}[\\s\\S]*?\\{/${key}}`, 'g');
      }
      val = null;
    } else {
      replacementRegEx = new RegExp(`\\{${key}}`, 'g');
    }
    processedText = processedText.replaceAll(replacementRegEx, val ?? '');
  });

  processedText = processedText.replaceAll(/\{=(.+?)\}/g, (_, expression) => {
    if (/[^-+*/0-9. ()[\]]/.test(expression)) {
      throw new Error(`Invalid expression: ${expression}`);
    }
    while (/\[.+\]/.test(expression)) {
      expression = expression.replaceAll(/\[([^\]]+?)\]/g, (_, arg) => `Math.round(${arg})`);
    }
    return eval(expression);
  });

  return processedText;
};
