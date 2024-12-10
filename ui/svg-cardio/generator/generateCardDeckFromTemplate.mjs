/*
 *  Copyright 2024 Thomas Rosenau
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { processTemplate } from './processTemplate.mjs';
import { getDimensions } from './dimensions.mjs';

// TODO: move to template
const totalCardWidth = 60;
const totalCardHeight = 90;
const borderWidth = 0.5;
const verticalPadding = 4;
const horizontalPadding = 3.5;
const cornerRadius = 4.5;
const frameBorderWidth = 0.4;

const dimensions = getDimensions({
  totalCardWidth,
  totalCardHeight,
  borderWidth,
  verticalPadding,
  horizontalPadding,
  cornerRadius,
  frameBorderWidth
});


const suitNames = ['diamonds', 'hearts', 'spades', 'clubs'];

export const generateDeck = ({ template, fontCSS = '', debug = false }) => {

  let suits = [3, 1, 2, 0];
  if (template.suits === null) {
    suits = [-1];
  }

  let result = [];
  suits.forEach(suit => {

    template.figures.forEach(cardValue => {

      let isPicture = ['B', 'D', 'K'].includes(cardValue);

      let suitName = suitNames[suit] || 'card';

      let suitSymbols = '';

      if (Object.hasOwn(dimensions.suitSymbolPositions, cardValue)) {
        suitSymbols = dimensions.suitSymbolPositions[cardValue].reduce((result, [x, y]) => {
          let rotation = '';
          if (y > 0) {
            rotation = ' rotate(180)';
          }
          let scaling = '';
          if (isPicture) {
            scaling = ' scale(.75)';
          }
          result += `<use href="#suit-symbol-${suitName}" transform="translate(${x}, ${y})${rotation}${scaling}"/>`;
          return result;
        }, '');
      }

      let illustration = '';

      if (isPicture) {
        illustration = template.illustration({ suit, cardValue, dimensions });
      }

      let args = {
        ...dimensions,
        cardValue,
        verticalTextOffset: isPicture ? dimensions.verticalTextOffsetPicture : dimensions.verticalTextOffsetNumber,
        suitName,
        suitSymbolPath: template.suitSymbolPaths?.[suit],
        suitSymbols,
        isDebug: debug,
        fontCSS,
        isPicture,
        illustration
      };
      result.push({ text: processTemplate(template.text, args), suitName, cardValue });
    });
  });
  return result;
};
