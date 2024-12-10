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

    svg.background-blue .face2 {
      opacity: .18;
    }
    
    svg.background-red .base {
      fill: #c10;
    }
    
    svg.background-red .stroke {
      stroke: #c10;
    }
    
    svg.background-green .base {
      fill: #7bc203;
    }
    
    svg.background-green .stroke {
      stroke: #7bc203;
    }
    
    svg.background-green .face1 {
      opacity: .15;
    }

    svg.background-black .base {
      fill: #123;
    }
    
    svg.background-black .stroke {
      stroke: #123;
    }
    
    svg.background-black .face1 {
      fill: #ddd;
    }
    
  ]]>
  </style>
  <defs>
    <pattern id="Pattern" width="6.928" height="12" patternUnits="userSpaceOnUse" patternTransform="scale({= ({innerWidth} - 1)/(6.928*[({innerWidth} - 1)/6.928]) }, {= ({innerHeight} - 1)/(12*[({innerHeight} - 1)/12]) })">
    <path d="M0,0v4 l 6.928,4 v4 l-3.464-2v-8z" class="face1" fill="black" opacity=".2"/>
    <path d="M0,12v-4 l6.928,-4v-4l-3.464 2v8z" class="face2" fill="white" opacity=".3"/>
    </pattern>
  </defs>

  <rect width="{totalCardWidth}" height="{totalCardHeight}" x="-{={totalCardWidth}/2}" y="-{={totalCardHeight}/2}" stroke="black" stroke-width="{borderWidth}" fill="white" rx="{cornerRadius}" />
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" rx="2" class="base" />
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" rx="2" fill="url(#Pattern)" stroke-width="1" class="stroke"/>

</svg>`;

export const figures = ['blue', 'red', 'green', 'black'];
export const suits = null;

export const demoPage = 'back';
