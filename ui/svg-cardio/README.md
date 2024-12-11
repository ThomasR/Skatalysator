# svg-card-i/o

A template based SVG playing card generator.

[**<img style="height: 3em;" src="https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/github-mark.svg" alt="github logo"> View on GitHub**](https://github.com/ThomasR/Skatalysator/blob/main/ui/svg-cardio/)

This tool can generate playing card SVG images from a template and various parameters.

You can change the card width/height, the vertical/horizontal padding, the border width, border radius and inner frame width to receive different outputs like these:

![7 of hearts, default](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/hearts-7.svg)
![7 of hearts, large](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/hearts-7-large.svg)
![7 of hearts, mini](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/hearts-7-mini.svg)

The tool will place the suit symbols precisely in the points seen in this image:

![diagram of calculated intersection points](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/hearts-7-debug.svg)

## Usage

If you just want to use the pre-generated cards, see [svgs/](https://github.com/ThomasR/Skatalysator/tree/gh-pages/ui/svg-cardio/svgs).

To create your own, adjust the dimensions in [generateCardDeckFromTemplate.mjs](./generator/generateCardDeckFromTemplate.mjs)*, and run `npm install`. This will overwrite the contents of the `svgs` folder.

Or you can use the tool programmatically like this:

```js
import { generateDeck } from 'svg-cardio';

// see generateAll.mjs for possible values
const templateName = 'emoji';

const template = await import(`svg-cardio/templates/template-${templateName}`);

let svgText = generateDeck({ template, debug: false });
```

This works in Node or in the browser. See [demoPage-inline.html](https://thomasr.github.io/Skatalysator/ui/svg-cardio/demoPage-inline.html) for a usage example.


*I know this is not ideal…

## Included templates

This package comes with 2 card themes, _Emoji_ and _[Fowler](https://tekeye.uk/playing_cards/svg-playing-cards)_. Both are available with standard suit colors (black, red) or "international" colors (black, red, green, orange).

You will find the cards pre-generated in 60x90mm in the [svgs/](https://github.com/ThomasR/Skatalysator/tree/gh-pages/ui/svg-cardio/svgs) folder along with HTML pages to view them.

![Emoji card deck](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/emoji-deck.png)
![Fowler](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/tekeye-deck.png)


This package also comes with various card back templates, each available in multiple colors.

See the [svgs/](https://github.com/ThomasR/Skatalysator/tree/gh-pages/ui/svg-cardio/svgs) folder for the pre-generated versions in 60x90mm. 

![Red card back with circles pattern](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-circles-red.svg)
![Blue card back with circles pattern](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-circles2-blue.svg)
![Green card back with interconnected pattern](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-interconnected-green.svg)
![Purple card back with fleur de lis pattern](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-fleur-purple.svg)
![Red card back with cube pattern](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-cubes-red.svg)
![Black card back with lozenges pattern](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-lozenges-black.svg)

See the demo pages &#x005B; [1](https://thomasr.github.io/Skatalysator/ui/svg-cardio/svgs/back-circles/back.html), [2](https://thomasr.github.io/Skatalysator/ui/svg-cardio/svgs/back-circles2/back.html), [3](https://thomasr.github.io/Skatalysator/ui/svg-cardio/svgs/back-interconnected/back.html), [4](https://thomasr.github.io/Skatalysator/ui/svg-cardio/svgs/back-fleur/back-purple.html), [5](https://thomasr.github.io/Skatalysator/ui/svg-cardio/svgs/back-cubes/back.html), [6](https://thomasr.github.io/Skatalysator/ui/svg-cardio/svgs/back-lozenges/back.html) &#x005D; for more colors.

Notice how the patterns align nicely with all edges. As you change the card or padding size, the pattern gets slightly stretched, so it always fits perfectly:

![Blue circle pattern, stretched](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-circles2-blue-small.svg)
![Blue circle pattern, stretched](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-circles2-medium.svg)
![Blue circle pattern, stretched](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/ui/svg-cardio/docs/back-circles2-large.svg)

## Writing a template

The best way to get started is to duplicate an existing template from the [templates](./templates) folder.

A template file must export a `text`, a `demoPage`, a list of `suits` and a list of `figures`.

Inside the text you can use placeholders of the form `{placeholder}` that will be replaced with the corresponding values.

The complete list of available placeholders is   `borderWidth`,
  `cardValue`, `cornerRadius`, `debugMarkup`, `fontCSS`, `fontSize`, `frameBorderWidth`, `frameGapSize`, `halfSymbolWidth`, `horizontalPadding`, `illustration`, `innerHeight`, `innerMaxX`, `innerMaxY`, `innerWidth`, `isDebug`, `isPicture`, `suitName`, `suitSymbolPath`, `suitSymbolScalingFactor`, `suitSymbols`, `totalCardHeight`, `totalCardWidth`, `totalSVGHeight`, `totalSVGWidth`, `verticalPadding`, `verticalSymbolOffset`, `verticalTextOffset`, `verticalTextOffsetNumber`, `verticalTextOffsetPicture`, `viewBox`.

Conditionals are available using `{?isBoolean}conditionalContent{/isBoolean}`.

Apart from placeholder replacement,  the tool can also do basic math using the syntax `{=1+2}`. Other than the standard math operations, it also supports `Math.round` using the `[]` symbols. So `{=[1.75]}` results in the output `2`. A sophisticated example from one of the predefined templates:
```
scale({= {innerWidth}/(11*[{innerWidth}/11]) }, {= {innerHeight}/( 22*[{innerHeight}/22]) })
```
This will calculate scaling factors that fill the available space with an integer count of background elements (which are of size 11x22).
