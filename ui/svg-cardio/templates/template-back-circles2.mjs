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
      stroke: #2a4fd0;
    }

    svg.background-red .base {
      fill: #c10;
    }
    
    svg.background-red .stroke {
      stroke: #c10;
    }
    
    svg.background-green .base {
      fill: #4c7901;
    }
    
    svg.background-green .stroke {
      stroke: #4c7901;
    }
    
    svg.background-black .base {
      fill: #123;
    }
    
    svg.background-black .stroke {
      stroke: #123;
    }
    
  ]]>
  </style>
  <defs>
    <pattern id="Pattern" x="5" y="5" width="10" height="10" viewBox="0 0 5 5" patternUnits="userSpaceOnUse" patternTransform="scale({= ({innerWidth})/(10*[({innerWidth})/10]) }, {= ({innerHeight})/(10*[({innerHeight})/10]) })">
      <g class="base">
        <circle cx="2.5" cy="2.5" r=".3" />
        <circle cx="0" cy="0" r=".3" />
        <circle cx="0" cy="5" r=".3" />
        <circle cx="5" cy="0" r=".3" />
        <circle cx="5" cy="5" r=".3" />
      </g>
      <g stroke-width=".95" class="stroke" fill="none">
        <circle cx="2.5" cy="2.5" r="2.5" />
        <circle cx="0" cy="0" r="2.5" />
        <circle cx="0" cy="5" r="2.5" />
        <circle cx="5" cy="0" r="2.5" />
        <circle cx="5" cy="5" r="2.5" />
      </g>
      <g stroke="white" stroke-width=".25" fill="none">
        <circle cx="2.5" cy="2.5" r="2.5"/>
        <circle cx="0" cy="0" r="2.5" />
        <circle cx="0" cy="5" r="2.5" />
        <circle cx="5" cy="0" r="2.5" />
        <circle cx="5" cy="5" r="2.5" />
      </g>
    </pattern>
  </defs>

  <rect width="{totalCardWidth}" height="{totalCardHeight}" x="-{={totalCardWidth}/2}" y="-{={totalCardHeight}/2}" stroke="black" stroke-width="{borderWidth}" fill="white" rx="{cornerRadius}" />
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" rx="1" fill="url(#Pattern)" class="stroke" stroke-width=".6"/>

</svg>`;

export const figures = ['blue', 'red', 'green', 'black'];
export const suits = null;

export const demoPage = 'back';
