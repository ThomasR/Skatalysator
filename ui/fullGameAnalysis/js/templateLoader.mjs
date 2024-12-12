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


/**
 * A simple template loader for HTML fragments.
 *
 * Usage: Put a script tag like this into your HTML file:

 <script src="templateLoader.mjs" type="module">
   {{include-something.html}}
 </script>

 * Placeholders of the form {{foo}} will be replaced with the contents of the referenced file.
 * Replacement works recursively, i.e. you can also use placeholders in the templates
 */

const processTemplate = async (text, baseURL = location.href) => {
  let imports = Array.from(text.matchAll(/\{\{([^}]+?)\}\}/g));
  const promises = imports.map(async ([placeholder, href]) => {
    let url = new URL(href, baseURL);
    let replacement = await (await fetch(url, { cache: 'no-cache' })).text();
    replacement = await processTemplate(replacement, url);
    return { placeholder, replacement };
  });

  const results = await Promise.all(promises);

  for (let { placeholder, replacement } of results) {
    text = text.replace(placeholder, replacement);
  }
  return text;
};

const randomId = `loader${String(Math.round(Math.random() * 10 ** 16))}`;

const insertScriptMarkers = text => text.replaceAll(/<script\b/g, `<script data-${randomId} `);

// see https://stackoverflow.com/questions/57209520/script-injected-with-insertadjacenthtml-does-not-execute
const loadScripts = () => {
  for (let scriptTpl of document.querySelectorAll(`script[data-${randomId}]`)) {
    let script = document.createElement('script');
    for (let attribute of scriptTpl.attributes) {
      if (attribute.name === `data-${randomId}`) {
        continue;
      }
      script.setAttribute(attribute.name, scriptTpl.getAttribute(attribute.name));
    }
    script.textContent = scriptTpl.textContent;
    scriptTpl.replaceWith(script);
  }
};

const removeComments = text => text.replaceAll(/<!--.*?-->/g, '');

let myScripts = [...document.querySelectorAll('script')].filter(s => s.src === import.meta.url);

for (const s of myScripts) {
  let text = s.textContent;
  text = await processTemplate(text);
  text = removeComments(text);
  text = insertScriptMarkers(text);
  s.insertAdjacentHTML('afterend', text);
  s.remove();
  loadScripts();
}

document.dispatchEvent(new CustomEvent('templateloader:done'));
