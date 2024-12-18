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

import fs from 'node:fs';
import path from 'node:path';

import { generateDeck } from './generateCardDeckFromTemplate.mjs';

/* eslint-disable no-console */
export const writeCardsToFolder = async ({ templateName, targetFolder = './svgs', debug = false }) => {

  const template = await import(`svg-cardio/templates/template-${templateName}`);

  console.log(`Processing template "${templateName}"`);

  const fontCSS = fs.readFileSync(path.resolve(import.meta.dirname, '../fonts/Lora/lora-inline.css'));

  let targetSubfolder = `${targetFolder}/${templateName}`;

  let targetDirExists;
  try {
    targetDirExists = fs.statSync(targetSubfolder).isDirectory();
  } catch {
    targetDirExists = false;
  }
  if (!targetDirExists) {
    fs.mkdirSync(targetSubfolder, { recursive: true });
  }

  let cards = generateDeck({ template, fontCSS, debug });
  cards.forEach(({ text, suitName, cardValue }) => {
    let filename = `${targetSubfolder}/${suitName}-${cardValue}.svg`;
    console.log('Writing', filename);
    fs.writeFileSync(filename, text, 'utf-8');
  });

  const htmlText = fs.readFileSync(path.resolve(import.meta.dirname, `../templates/${template.demoPage}.html`), 'utf-8');
  const targetFile = path.resolve(`${targetSubfolder}/${template.demoPage}.html`);
  fs.writeFileSync(targetFile, htmlText.replace('{templateName}', templateName));
  console.log(`\nDone. Open ${targetFile} to look at the cards.\n`);
};
