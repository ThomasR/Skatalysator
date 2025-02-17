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
    class="card background-{cardValue} val-0"
    width="{totalSVGWidth}mm" height="{totalSVGHeight}mm"
    viewBox="{viewBox}"
>
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
    svg {
      width: 100%;
      height: 100%;
    }

    svg > * {
      pointer-events: none;
    }
    
    svg.background-blue .base {
      fill: #2a4fd0;
    }
    
    svg.background-blue .stroke {
      stroke: #09235b;
    }
    
    svg.background-red .base {
      fill: #c10;
    }
    
    svg.background-red .stroke {
      stroke: #771c11;
    }
    
    svg.background-green .base {
      fill: #6dab02;
    }
    
    svg.background-green .stroke {
      stroke: #359618;
    }
    
    svg.background-black .base {
      fill: #000;
    }
    
    svg.background-black .stroke {
      stroke: #666;
    }
    
  ]]>
  </style>
  <defs>
    <pattern id="Pattern" x="-3.5" y="-3.5" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="scale({= ({innerWidth} - 1)/(7*[({innerWidth} - 1)/7]) }, {= ({innerHeight} - 1)/(7*[({innerHeight} - 1)/7]) })">
      <g stroke-width=".7" class="stroke">
        <path d="M3.5 0 a 3.5 3.5 0 0 0 3.5 3.5 a 3.5 3.5 0 0 0 -3.5 -3.5zM0 3.5 a 3.5 3.5 0 0 0 3.5 3.5 a 3.5 3.5 0 0 0 -3.5 -3.5z" fill="white" fill-opacity=".9"/>
        <path d="M7 3.5 a 3.5 3.5 0 0 0 -3.5 3.5 a 3.5 3.5 0 0 0 3.5 -3.5zM3.5 0 a 3.5 3.5 0 0 0 -3.5 3.5 a 3.5 3.5 0 0 0 3.5 -3.5z" fill="white" fill-opacity=".65"/>
      </g>
    </pattern>
  </defs>

  <rect width="{totalCardWidth}" height="{totalCardHeight}" x="-{={totalCardWidth}/2}" y="-{={totalCardHeight}/2}" stroke="black" stroke-width="{borderWidth}" fill="white" rx="{cornerRadius}" />
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" rx="1" class="base" />
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" rx="1" fill="url(#Pattern)" class="stroke" stroke-width="1" />

</svg>`;

export const figures = ['blue', 'red', 'green', 'black'];
export const suits = null;

export const demoPage = 'back';
