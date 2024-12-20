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

export const baseText = `<svg
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

    .frame {
        stroke-width: {frameBorderWidth};
    }
    
    svg.val-A .suit-symbols {
        transform: scale(2);
    }
    
    {suitColors}
  ]]>
  </style>
  <defs>
    <path id="suit-symbol-{suitName}" d="{suitSymbolPath}" transform="scale({suitSymbolScalingFactor})"/>
{?isPicture}
    <clipPath id="frame">
      <rect width="{={innerWidth}-{frameBorderWidth}}" height="{={innerHeight}-{frameBorderWidth}}" x="-{={innerMaxX}-{frameBorderWidth}/2}" y="-{={innerMaxY}-{frameBorderWidth}/2}" rx="{={cornerRadius} - {verticalPadding}/2}" fill="red"/>
    </clipPath>
    <clipPath id="frame-gap">
      <path d="M-{={totalCardWidth}/2},-{={totalCardHeight}/2}h{totalCardWidth}v{totalCardHeight}h-{totalCardWidth}ZM-{={innerMaxX}-1},{=1.5-{innerMaxY}}h-2v{frameGapSize}h2zM{innerMaxX},{innerMaxY}m-1,-1.5h2v-{frameGapSize}h-2z"/>
    </clipPath>
{/isPicture}
  </defs>
  <rect width="{totalCardWidth}" height="{totalCardHeight}" x="-{={totalCardWidth}/2}" y="-{={totalCardHeight}/2}" rx="{cornerRadius}" fill="white" stroke="black"
    stroke-width="{borderWidth}"/>
  <g class="filled">
{?isPicture}
    <rect class="frame" width="{innerWidth}" height="{innerHeight}" x="-{innerMaxX}" y="-{innerMaxY}" rx="{={cornerRadius} - {verticalPadding}/2}" fill="none" clip-path="url(#frame-gap)"/>
    <text font-size="{={totalCardHeight}/2}" text-anchor="middle" y="{={totalCardHeight}/6}">{cardValue}</text>
{/isPicture}
    <g id="top-labels-{suitName}-{cardValue}">
      <text y="{verticalTextOffset}" style="text-anchor: end;{?isPicture}display: none;{/isPicture}" transform="translate({innerMaxX}, -{innerMaxY}) scale(.7, 1)">{cardValue}</text>
      <text y="{verticalTextOffset}" transform="translate(-{innerMaxX}, -{innerMaxY}) scale(.7, 1)">{cardValue}</text>
      <use href="#suit-symbol-{suitName}"
        transform="{?isPicture}translate(0, -{={totalCardWidth}/55}) {/isPicture}translate(-{innerMaxX}, {={verticalTextOffset}+{verticalSymbolOffset}-{innerMaxY}}) scale(.375) translate({halfSymbolWidth}, 0)"/>
      <use {?isPicture}style="display: none;"{/isPicture} href="#suit-symbol-{suitName}"
        transform="translate({innerMaxX}, {={verticalTextOffset}+{verticalSymbolOffset}-{innerMaxY}}) scale(.375) translate(-{halfSymbolWidth}, 0)"/>
    </g>
    <use href="#top-labels-{suitName}-{cardValue}" transform="rotate(180)"/>
    <g class="suit-symbols">
      {suitSymbols}
    </g>
  </g>
{?isDebug}
  {debugMarkup}
{/isDebug}
</svg>
`;

export const text = baseText.replace('{suitColors}', `
    svg.diamonds .filled,
    svg.hearts .filled {
        fill: #d40000;
    }
    svg.diamonds .frame,
    svg.hearts .frame {
        stroke: #d40000;
    }
    svg.spades .filled,
    svg.clubs .filled {
        fill: #000;
    }
    svg.spades .frame,
    svg.clubs .frame {
        stroke: #000;
    }`);

export const figures = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'J', 'D', 'Q', 'K'];

export const demoPage = 'all';

export const suitSymbolPaths = [ // 13x13
  'M0,7.5L6.75,0L0,-7.5L-6.75,0z',
  'M 0,7.31C1.6,5.56 3.53,3.19 4.7,1.88 9.8,-3.83 3.28,-9.33 0,-5 -3.28,-9.33 -9.8,-3.83 -4.7,1.88-3.53,3.19 -1.6,5.56 0,7.31Z',
  'M 2.808,7.203 C 0.6,6.036 0.743,4.505 0.625,3.467 4.267,6.76 9.868,1.892 4.004,-2.436 2.803,-3.322 1.896,-4.173 0,-7.262 C -1.896,-4.173 -2.803,-3.322 -4.004,-2.436 -9.868,1.892 -4.267,6.76 -0.625,3.467 -0.743,4.505 -0.6,6.036 -2.808,7.203 Z',
  'M 2.6,6.6C 0,6.1 .6,4.6 0.54,0.17A 3 3 0 1 0 1.31,-1.09A 3 3 0 1 0 -1.31,-1.09A 3 3 0 1 0 -0.54,0.17C -0.6,4.6 0,6.1 -2.6,6.6z'
];

export const illustration = () => '';
