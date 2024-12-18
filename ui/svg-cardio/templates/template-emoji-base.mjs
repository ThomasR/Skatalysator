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

export const text = `<svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet" 
    class="card {suitName} val-{cardValue}" 
    width="{totalSVGWidth}mm" height="{totalSVGHeight}mm"
    viewBox="{viewBox}"
  >
  <title>{cardValue} of {suitName} playing card</title>
  <metadata>
    Copyright 2024 Thomas Rosenau
 
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
 
        http://www.apache.org/licenses/LICENSE-2.0
 
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  </metadata>
  <style><![CDATA[
    {fontCSS}

    svg {
        font: bold {fontSize}px Lora, serif;
        width: 100%;
        height: 100%;
    }

    svg > * {
        pointer-events: none;
    }
  
    {suitColors}
  
    .frame {
        stroke-width: {frameBorderWidth};
    }
  ]]>
  </style>
  <defs>
    <path id="suit-symbol-{suitName}" d="{suitSymbolPath}" transform="scale({suitSymbolScalingFactor})"/>
{?isPicture}
    <clipPath id="frame-upper">
      <rect width="{={innerWidth}-{frameBorderWidth}}" height="{={innerMaxY}*3/4-{frameBorderWidth}}" x="-{={innerMaxX}-{frameBorderWidth}/2}" y="-{={innerMaxY}-{frameBorderWidth}/2}" rx="{={cornerRadius} - {verticalPadding}/2}" />
      <rect width="{={innerWidth}-{frameBorderWidth}}" height="{={innerHeight}/4-{frameBorderWidth}}" x="-{={innerMaxX}-{frameBorderWidth}/2}" y="-{={innerMaxY}/2-{frameBorderWidth}/2}" />
    </clipPath>
    <clipPath id="frame-gap">
      <path d="M-{={totalCardWidth}/2},-{={totalCardHeight}/2}h{totalCardWidth}v{totalCardHeight}h-{totalCardWidth}ZM-{={innerMaxX}-1},{=2-{innerMaxY}}h-2v{frameGapSize}h2zM-{innerMaxX},{innerMaxY}m-1,-2h2v-{frameGapSize}h-2zM{innerMaxX},{innerMaxY}m-1,-2h2v-{frameGapSize}h-2zM{={innerMaxX}-1},{=2-{innerMaxY}}v{frameGapSize}h2v-{frameGapSize}z"/>
    </clipPath>
{/isPicture}
  </defs>
  <rect width="{totalCardWidth}" height="{totalCardHeight}" x="-{={totalCardWidth}/2}" y="-{={totalCardHeight}/2}" rx="{cornerRadius}" fill="white" stroke="black"
    stroke-width="{borderWidth}"/>
{?isPicture}
  <rect class="frame" width="{innerWidth}" height="{innerHeight}" x="-{innerMaxX}" y="-{innerMaxY}" rx="{={cornerRadius} - {verticalPadding}/2}" stroke="black" fill="none" clip-path="url(#frame-gap)"/>
{/isPicture}
  <g class="filled">
    <g id="top-labels-{suitName}-{cardValue}">
      <text y="{verticalTextOffset}" style="text-anchor: end;" transform="translate({innerMaxX}, -{innerMaxY}) scale(.7, 1)">{cardValue}</text>
      <text y="{verticalTextOffset}" transform="translate(-{innerMaxX}, -{innerMaxY}) scale(.7, 1)">{cardValue}</text>
      <use href="#suit-symbol-{suitName}"
        transform="translate(-{innerMaxX}, {={verticalTextOffset}+{verticalSymbolOffset}-{innerMaxY}}) scale(.375) translate({halfSymbolWidth}, 0)"/>
      <use href="#suit-symbol-{suitName}"
        transform="translate({innerMaxX}, {={verticalTextOffset}+{verticalSymbolOffset}-{innerMaxY}}) scale(.375) translate(-{halfSymbolWidth}, 0)"/>
    </g>
    <use href="#top-labels-{suitName}-{cardValue}" transform="rotate(180)"/>
    {suitSymbols}
{?isPicture}
    {illustration}
{/isPicture}
  </g>
{?isDebug}
  {debugMarkup}
{/isDebug}
{?isPicture}
  <line class="frame" x1="-{innerMaxX}" y1="0" x2="{innerMaxX}" y2="0" stroke="#808080" />
{/isPicture}
</svg>
`;

export const figures = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'D', 'K'];

export const demoPage = 'all';

export const suitSymbolPaths = [ // 13x13
  'M0,7.5C.5,6 5,.5 6.75,0C5,-.5 .5,-6 0,-7.5C-.5,-6-5,-.5-6.75,0C-5,.5-.5,6 0,7.5',
  'M 0,7.31 C 0.6,5.561 3.527,3.195 4.698,1.884 9.802,-3.829 3.284,-10.021 0,-4.228 C -3.284,-10.021 -9.802,-3.829 -4.698,1.884 -3.527,3.195 -0.6,5.561 0,7.31 Z',
  'M 2.81,7.2C 0,7.2 0.7,2.74 0.59,1.7 2.2,8.08 10.73,2.68 4,-2.44 2.82,-3.34 1.9,-4.17 0,-7.26-1.9,-4.17 -2.82,-3.34 -4,-2.44 -10.73,2.68 -2.2,8.08 -0.59,1.7 -0.7,2.74 -0,7.2-2.81,7.2Z',
  'M2.6,6.6 C 1.5,6.1 .6,5 .6,2.2 A 3.05 3.05 0 1 0 2.45-1.8 A 3.05 3.05 0 1 0-2.45-1.8A 3.05 3.05 0 1 0-.6,2.2C-.6,5-1.5,6.1-2.6,6.6z'
];

export const illustration = ({ suit, cardValue, dimensions }) => {
  let modifier = ['\u{1f3fc}', '', '\u{1f3fb}', '\u{1f3fd}'][suit];
  let emoji = {
    B: `\u{1f468}${modifier}\u{200d}\u{1f33e}`,
    D: `\u{1f478}${modifier}`,
    K: `\u{1f934}${modifier}`
  }[cardValue];
  let size = cardValue === 'B' ? dimensions.innerMaxY * 0.9 : dimensions.innerMaxY * 0.97;
  let illustration = `<g style="font-size: ${size}px; text-anchor: middle; text-shadow: 0 0 15px rgba(0, 0, 0, .15)">`;
  illustration += `<text clip-path="url(#frame-upper)" dominant-baseline="text-after-edge" y="7.5">${emoji}</text>`;
  illustration += `<text clip-path="url(#frame-upper)" dominant-baseline="text-after-edge" y="7.5" transform="rotate(180)">${emoji}</text>`;
  illustration += '</g>';
  return illustration;
};
