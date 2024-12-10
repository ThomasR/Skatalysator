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

const getSuitSymbolPositions = ({ innerMaxX, innerMaxY }) => {
  let symbolX = innerMaxX / 2;
  let symbolY1 = -innerMaxY * 3 / 4;
  let symbolY2 = -innerMaxY / 2;
  let symbolY3 = -innerMaxY / 4;
  let symbolY4 = symbolY1 / 2;

  const shared = [[symbolX, symbolY1], [symbolX, -symbolY1], [-symbolX, symbolY1], [-symbolX, -symbolY1]];
  let s6 = [...shared, [symbolX, 0], [-symbolX, 0]];
  let s7 = [...s6, [0, symbolY4]];
  const s910 = [...shared, [symbolX, symbolY3], [symbolX, -symbolY3], [-symbolX, symbolY3], [-symbolX, -symbolY3]];

  let pictureX = -5 / 8 * innerMaxX;

  return {
    A: [[0, 0]],
    2: [[0, symbolY1], [0, -symbolY1]],
    3: [[0, symbolY1], [0, 0], [0, -symbolY1]],
    4: shared,
    5: [...shared, [0, 0]],
    6: s6,
    7: s7,
    8: [...s7, [0, -symbolY4]],
    9: [...s910, [0, 0]],
    10: [...s910, [0, symbolY2], [0, -symbolY2]],
    B: [[pictureX, symbolY1], [-pictureX, -symbolY1]],
    D: [[pictureX, symbolY1], [-pictureX, -symbolY1]],
    K: [[pictureX, symbolY1], [-pictureX, -symbolY1]]
  };
};

const getDebugPath = ({ totalCardWidth, totalCardHeight, innerMaxX, innerMaxY }) => {
  let symbolX = innerMaxX / 2;
  let symbolY1 = -innerMaxY * 3 / 4;

  let debugPath = `M-${totalCardWidth / 2},0h${totalCardWidth}M-${totalCardWidth / 2},${innerMaxY}h${totalCardWidth}M-${totalCardWidth / 2},${-innerMaxY}h${totalCardWidth}`;
  for (let i = 0; i <= 8; i++) {
    let x = innerMaxX * (i / 4 - 1);
    debugPath += `M${x}${-totalCardHeight / 2}v${totalCardHeight}`;
  }
  debugPath += `M${innerMaxX},${innerMaxY}L${-innerMaxX},0L${innerMaxX},${-innerMaxY}`;
  debugPath += `M${-innerMaxX},${innerMaxY}L${innerMaxX},0L${-innerMaxX},${-innerMaxY}`;
  debugPath += `M${symbolX},${symbolY1}L${-symbolX},0L${symbolX},${-symbolY1}`;
  debugPath += `M${-symbolX},${symbolY1}L${symbolX},0L${-symbolX},${-symbolY1}`;
  debugPath += `M${-3 / 4 * innerMaxX},${symbolY1} h${innerMaxX / 4}`;
  debugPath += `M${3 / 4 * innerMaxX},${-symbolY1} h${-innerMaxX / 4}`;
  return debugPath;
};

export const getDimensions = ({
  totalCardWidth = 60,
  totalCardHeight = 90,
  verticalPadding = 4,
  horizontalPadding = 3.5,
  borderWidth = 0.5,
  cornerRadius = 4.5,
  frameBorderWidth = 0.4
} = {}) => {

  let innerWidth = totalCardWidth - 2 * horizontalPadding;
  let innerHeight = totalCardHeight - 2 * verticalPadding;

  let innerMaxX = innerWidth / 2;
  let innerMaxY = innerHeight / 2;


  const suitSymbolPositions = getSuitSymbolPositions({ innerMaxX, innerMaxY });
  const debugPath = getDebugPath({ totalCardWidth, totalCardHeight, innerMaxX, innerMaxY });

  let debugMarkup = `<path class="debug" d="${debugPath}" stroke="black" stroke-width=".1" stroke-dasharray="1 .5"  fill="none"/>`;
  debugMarkup += '<g fill="#69f" opacity=".8">';
  let seen = new Set();
  let suitSymbolPositionsUniq = Object.values(suitSymbolPositions).flat(1).filter(pair => {
    let hash = String(pair);
    if (seen.has(hash)) {
      return false;
    }
    seen.add(hash);
    return true;
  });
  suitSymbolPositionsUniq.forEach(([cx, cy]) => {
    debugMarkup += `<circle r=".6" cx="${cx}" cy="${cy}"/>`;
  });
  debugMarkup += '</g>';

  let totalSVGWidth = totalCardWidth + borderWidth;
  let totalSVGHeight = totalCardHeight + borderWidth;
  let viewBox = `${-totalSVGWidth / 2} ${-totalSVGHeight / 2} ${totalSVGWidth} ${totalSVGHeight}`;

  return Object.freeze({
    borderWidth,
    cornerRadius,
    debugMarkup,
    fontSize: innerMaxX / 3,
    frameGapSize: innerMaxX / 2.3 + 3,
    frameBorderWidth,
    halfSymbolWidth: innerMaxX / 4,
    horizontalPadding,
    innerHeight,
    innerMaxX,
    innerMaxY,
    innerWidth,
    suitSymbolPositions,
    suitSymbolScalingFactor: innerMaxX / 26,
    totalCardHeight,
    totalCardWidth,
    totalSVGHeight,
    totalSVGWidth,
    verticalPadding,
    verticalSymbolOffset: innerMaxX / 5.3,
    verticalTextOffsetNumber: innerMaxX / 4,
    verticalTextOffsetPicture: innerMaxX / 4 + 3,
    viewBox
  });
};
