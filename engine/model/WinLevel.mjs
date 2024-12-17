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

export const WinLevel = {
  WIN_BLACK: Symbol('WIN_BLACK'),
  WIN_TAILOR: Symbol('WIN_TAILOR'),
  WIN_TAILORFREE: Symbol('WIN_TAILORFREE'),
  LOSS_TAILORFREE: Symbol('LOSS_TAILORFREE'),
  LOSS_TAILOR: Symbol('LOSS_TAILOR'),
  LOSS_BLACK: Symbol('LOSS_BLACK'),

  // score can range from -1 to 121
  getLevel(score) {
    if (score > 120) {
      return WinLevel.WIN_BLACK;
    }
    if (score >= 90) {
      return WinLevel.WIN_TAILOR;
    }
    if (score > 60) {
      return WinLevel.WIN_TAILORFREE;
    }
    if (score > 30) {
      return this.LOSS_TAILORFREE;
    }
    if (score >= 0) {
      return this.LOSS_TAILOR;
    }
    return this.LOSS_BLACK;
  }
};
