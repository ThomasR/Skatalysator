# Skatalysator ♣️♠️♥️♦️

<img alt="Skatalysator logo" src="https://raw.githubusercontent.com/ThomasR/Skatalysator/main/docs/3%20Jacks.png" style="width:142px;">

A free analysis engine for the card game [Skat](https://en.wikipedia.org/wiki/Skat_(card_game)).

[**<img style="height: 3em;" src="https://raw.githubusercontent.com/ThomasR/Skatalysator/main/docs/github-mark.svg" alt="github logo"> View on GitHub**](https://github.com/ThomasR/Skatalysator)

What this engine can do:

* Model entire games of Skat, including Null and Grand games
* Find the best move in a given situation, knowing all cards
  * Does not work for Null games yet

What this engine can **not** do:
* Play _without_ knowing the opponents' cards

**⚠️ This project is currently in development. ⚠️**

🇩🇪/🇬🇧 While Skat is mostly played in Germany, this project is authored in English for better inclusiveness.

## How to use

Prerequisites:

* [Node.js](https://nodejs.org/)


Setup:

```bash
npm install
```

### UI

This package includes a prototype, which you can try out on

[https://thomasr.github.io/Skatalysator/ui/fullGameAnalysis/](https://thomasr.github.io/Skatalysator/ui/fullGameAnalysis/).


There is only one predefined game that can be analyzed.

**⚠️ This prototype is nowhere near finished. ⚠️**

![UI Prototype Screenshot](https://raw.githubusercontent.com/ThomasR/Skatalysator/main/docs/UI%20prototype.png)

### Engine

Create a new Game:

```js
import { Game } from './engine/model/Game.mjs';
import { GameType } from './engine/model/GameType.mjs';

let distribution = {
  hands: [
    ['D7', 'SJ', 'H7', 'HQ', 'HK', 'S8', 'SK', 'SA', 'C8', 'CK'],
    ['DJ', 'DK', 'D9', 'C10', 'CQ', 'C9', 'C7', 'S9', 'S10', 'H10'],
    ['CJ', 'HJ', 'DA', 'D10', 'DQ', 'D8', 'CA', 'H8', 'HA', 'H9']
  ],
  skat: ['S7', 'SQ']
};

const game = new Game({
  distribution,
  gameType: GameType.DIAMONDS,
  currentPlayer: 1,
  soloPlayer: 2
});
```

Add moves that were played:

```js

// 1
game.playCard('C9');
game.playCard('CA');
game.playCard('C8');

// 2
game.playCard('CJ');
game.playCard('D7');
game.playCard('D9');

// 3
game.playCard('HJ');
game.playCard('SJ');
```

Inspect the game:

```js
console.log(game);
```

```text
-----
Game: Player 3 plays ♦
Pl.1: ♣K ♠A ♠K ♠8 ♥K ♥Q ♥7
Pl.2: ♦J ♦K ♣10 ♣Q ♣7 ♠10 ♠9 ♥10
Pl.3: ♦A ♦10 ♦Q ♦8 ♥A ♥9 ♥8
Skat: ♠Q ♠7
Table: ♥J ♠J --
Player 2 to move
Score: 16:0

History:
♣9 ♣A ♣8
♣J ♦7 ♦9
-----
```

Analyze the game:

```
import { SkatalysatorSearch } from './engine/analysis/RecursiveGameEvaluator.mjs';
console.log(new SkatalysatorSearch({ game }).minimax());
```

This will return the score that can be achieved with best play from the current position:

```text
78
```

You can aslo use `TrackingSkatalysatorSearch`, which will keep track of the optimal next move from this position,
but it is slower.

```
import { TrackingSkatalysatorSearch } from './engine/analysis/RecursiveGameEvaluator.mjs';

let searcher = new TrackingSkatalysatorSearch({ game });
console.log(searcher.minimax());
console.log(searcher.bestMoves);
```

```text
78
[ ♦K ]
```


#### Verbose logging

TODO: refactor the class hierarchy / create some factory

The `LoggingSkatalysatorSearch` constructor accepts a `logDepth` parameter if you want to inspect the internals:

```
new LoggingSkatalysatorSearch({ game, logDepth: 3 }).minimax();
```

```
Entering abSearch with α=-Infinity, β=Infinity. minimizing…
Move candidates: ♦K ♦J
Examining ♦K with bounds [-Infinity, Infinity]
  1 Entering abSearch with α=-Infinity, β=Infinity. minimizing…
  1 Move candidates: ♠A ♣K ♠K ♥K ♥Q ♥7 ♠8
  1 Examining ♠A with bounds [-Infinity, Infinity]
    2 Entering abSearch with α=-Infinity, β=Infinity. minimizing…
    2 Move candidates: ♠10 ♠9
    2 Examining ♠10 with bounds [-Infinity, Infinity]
      3 Entering abSearch with α=-Infinity, β=Infinity. MAXIMIZING…
      3 Move candidates: ♥A ♦A ♦10 ♦Q ♥8 ♦8 ♥9
      3 Examining ♥A with bounds [-Infinity, Infinity]
      3 ♥A is now best with score 37 > -Infinity.
      3 Examining ♦A with bounds [37, Infinity]

[etc…]

      3 Score: 62, Result: BETA_CUTOFF
    2 Score: 62, Result: NONE
  1 Score: 62, Result: NONE
Score: 62, Result: FINAL
Cache size 9275

```

`logDepth` can take values up to 30, but this produces **a lot** of ouptut.

## Feature list

- [x] Allows modeling color games
- [x] Allows modeling Null games
- [x] Allows modeling Grand games
- [x] Engine can analyze color games
  - [ ] Performance improvements
- [x] Engine can analyze Grand games
- [ ] Engine can analyze Null games
- [ ] UI
  - [x] Prototype
    - [x] Alpine.js application rewrite
      - [ ] dev docs
  - [x] Configurable design
  - [x] Spawn analysis engine as worker
  - [x] Mark mistakes in UI
  - [ ] Setup games
  - [ ] Undo/redo
  - [ ] Fork variation
  - [ ] Load/save games
  - [x] i18n
  - [ ] Editable player names
