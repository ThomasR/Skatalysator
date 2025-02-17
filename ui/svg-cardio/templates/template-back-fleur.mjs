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
      fill: #0d2d94;
    }

    svg.background-red .base {
      fill: #9d1002;
    }
    
    svg.background-purple .base {
      fill: #490165;
    }
    
    svg.background-black .base {
      fill: #002;
    }
    
  ]]>
  </style>
  <defs>
    <pattern id="Pattern" x="0" y="-5.5" viewBox="-5.5 -10.5 11 22" width="11" height="22" patternUnits="userSpaceOnUse" patternTransform="scale({= ({innerWidth})/(11*[({innerWidth})/11]) }, {= ({innerHeight})/(22*[({innerHeight})/22]) })">
      <path id="fleur" stroke="black" fill="gold" fill-opacity=".85" stroke-opacity=".4" stroke-width=".2" stroke-linejoin="round" d="M.965 1.545c1.619-1.745 2.561-.228 2.133.538C5.044 1.64 4.608-.24 3.5-.7 2.391-1.16.47-.284.347 1.545Zm-.06 1.091c.534.63 1.279-.031.715-.7 1.078-.125 1.352 1.005.782 1.475-.573.469-1.768.562-2.087-.775Zm-.636 0 .062.348c.205.193.264.36.306.547.044.19.235.354.407.444-.23.014-.33.14-.649-.126.007.188-.076.28-.159.371A.973.973 0 0 0 0 4.702a.973.973 0 0 0-.236-.482c-.083-.092-.166-.182-.16-.37-.318.265-.419.14-.648.125.172-.089.363-.254.407-.444a.96.96 0 0 1 .306-.547l.062-.348ZM0-4.664c-.308.789-.613 1.272-.898 1.779-.822 1.458-.467 1.92-.15 2.489.37.666.689 1.278.73 1.941h.636C.36.882.678.27 1.048-.396c.317-.57.673-1.031-.15-2.49C.613-3.39.308-3.875 0-4.664Zm-.965 6.21c-1.619-1.746-2.561-.229-2.133.537C-5.044 1.64-4.608-.24-3.5-.7c1.108-.46 3.03.416 3.152 2.245Zm.06 1.09c-.534.63-1.279-.031-.715-.7-1.078-.125-1.352 1.005-.782 1.475.572.469 1.767.562 2.086-.775ZM0 1.864h1.182a.16.16 0 0 0 0-.319h-2.364a.16.16 0 0 0 0 .319zm0 .454h1.182a.227.227 0 0 0 0-.454h-2.364a.227.227 0 0 0 0 .454zm0 .318h1.182a.16.16 0 0 0 0-.318h-2.364a.16.16 0 0 0 0 .318z"/>
      <use href="#fleur" style="transform:translate(5.5px, 12px) rotate(180deg)"/>
      <use href="#fleur" style="transform:translate(-5.5px, 12px) rotate(180deg)"/>
      <use href="#fleur" style="transform:translate(5.5px, -10px) rotate(180deg)"/>
      <use href="#fleur" style="transform:translate(-5.5px, -10px) rotate(180deg)"/>
    </pattern>
  </defs>

  <rect width="{totalCardWidth}" height="{totalCardHeight}" x="-{={totalCardWidth}/2}" y="-{={totalCardHeight}/2}" stroke="black" stroke-width="{borderWidth}" fill="white" rx="{cornerRadius}" />
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" rx="1" class="base"/>
  <rect width="{innerWidth}" height="{innerHeight}" x="{=-{innerWidth}/2}" y="{=-{innerHeight}/2}" rx="1" fill="url(#Pattern)" />

</svg>`;

export const figures = ['blue', 'red', 'purple', 'black'];
export const suits = null;

export const demoPage = 'back-purple';
