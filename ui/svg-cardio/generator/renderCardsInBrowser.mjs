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

import { generateDeck } from './generateCardDeckFromTemplate.mjs';

export const generate = async () => {

  const templateName = document.querySelector('[data-template-name]').dataset.templateName;
  const template = await import(`../templates/template-${templateName}.mjs`);

  document.title = `${templateName} Skat deck (inline)`;

  let figures = [...template.figures];

  if (figures.includes('J') && figures.includes('B')) {
    let figureToRemove = document.body.dataset.language === 'de' ? 'J' : 'B';
    figures.splice(figures.indexOf(figureToRemove), 1);
  }

  if (figures.includes('D') && figures.includes('Q')) {
    let figureToRemove = document.body.dataset.language === 'de' ? 'Q' : 'D';
    figures.splice(figures.indexOf(figureToRemove), 1);
  }

  let cards = generateDeck({ template: { ...template, figures }, debug: false });
  cards.forEach(card => {
    document.querySelector('main').insertAdjacentHTML('beforeend', card.text);
  });
};
