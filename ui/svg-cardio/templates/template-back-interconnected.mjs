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
      fill: #589300;
    }
    
    svg.background-green .stroke {
      stroke: #589300;
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
    <pattern id="Pattern" x="-3" y="-3" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(22.5)">
    <g stroke="white" opacity=".6" stroke-width=".5">
        <line x1="0" y1="0" x2="6" y2="6"/> 
        <line x1="3" y1="0" x2="3" y2="6"/> 
        <line x1="0" y1="6" x2="6" y2="0"/> 
        <line x1="0" y1="3" x2="6" y2="3"/> 
        <circle r=".8" class="base"></circle>
        <circle r=".8" cx="6" class="base"></circle>
        <circle r=".8" cy="6" class="base"></circle>
        <circle r=".8" cx="6" cy="6" class="base"></circle>
        <circle r=".8" cx="3" cy="3" class="base"></circle>
      </g>
    </pattern>
  </defs>

  <rect width="{totalCardWidth}" height="{totalCardHeight}" x="-{={totalCardWidth}/2}" y="-{={totalCardHeight}/2}" stroke="black" stroke-width="{borderWidth}" fill="white" rx="{cornerRadius}" />
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" class="base" rx="1"/>
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" fill="url(#Pattern)" class="stroke" stroke-width=".5" rx="1"/>

</svg>`;

export const figures = ['blue', 'red', 'green', 'black'];
export const suits = null;

export const demoPage = 'back';
