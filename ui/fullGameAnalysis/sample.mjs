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

import fixtureFromData from '../../engine/test/alphabeta-fixtures/fixtureFromData.mjs';

const { game } = await fixtureFromData({ gameId: '9020350-2', playedCardCount: 19 });

export default game;
