# Skatalysator ♣️♠️♥️♦️

<img alt="Skatalysator logo" src="docs/3%20Jacks.png" style="width:142px;">

A free analysis engine for the game of [Skat](https://en.wikipedia.org/wiki/Skat_(card_game)).

[**<img style="height: 3em;" src="docs/github-mark.svg" alt="github logo"> View on GitHub**](https://github.com/ThomasR/Skatalysator)

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

[https://thomasr.github.io/Skatalysator/ui/fullGameAnalysis/prototype/game.html]().


It is currently available in German only. There is only one predefined game that can be analyzed.

**⚠️ This prototype is nowhere near finished. ⚠️**

![UI Prototype Screenshot](docs/UI%20prototype.png)

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
import { RecursiveGameEvaluator } from './engine/analysis/RecursiveGameEvaluator.mjs';
console.log(new RecursiveGameEvaluator({ game }).evaluateGame());
```

```text
{
  score: 75,
  moves: [
    ♦K, ♥7, ♥10, ♥9, ♦J,
    ♦8, ♠A, ♣10, ♥8, ♣K,
    ♣Q, ♦A, ♠K
  ],
  forced: false,
  pointsSolo: 75,
  pointsDuo: 45
}
```
This returns the optimal move sequence for the rest of the game with `pointsSolo` and `pointsDuo` representing the
final score.

The `score` field is always equal to `pointsSolo`, except if one of the parties is black, in which case it equals `-1` or `121`
respectively.

If the current player has only one move alialable, `force` is set to `true`.

The returned object may also include a `hint` field, which currently can only take the value `'domination'`.
If this field is present, it means that the current player can enforce making all remaining points, and thus can
continue with open cards.

#### Verbose logging

The `RecursiveGameEvaluator` constructor also accepts a `logDepth` parameter if you want to inspect the internals:

```
console.log(new RecursiveGameEvaluator({ game, logDepth: 3 }).evaluateGame());
```

```
Entering minimax. Solo player is player 3, playing ♦.
Player 3 (max) trying card ♥J
  α=-Infinity, β=Infinity
  Player 1 (min) trying card ♠J
    α=-Infinity, β=Infinity
    Player 2 (min) trying card ♦J
      α=-Infinity, β=Infinity
    Score for ♦J: 89
    Player 2 (min) trying card ♦K
      α=-Infinity, β=89
    Score for ♦K: 75
    Best: ♦K ♥7 ♥10 ♥9 ♦J ♦8 ♠A ♣10 ♥8 ♣K ♣Q ♦A ♠K
  Score for ♠J: 75
  Best: ♠J ♦K ♥7 ♥10 ♥9 ♦J ♦8 ♠A ♣10 ♥8 ♣K ♣Q ♦A ♠K
Score for ♥J: 75

[…]

Player 3 (max) trying card ♦Q
  α=87, β=Infinity
  Player 1 (min) trying card ♠J
    α=87, β=Infinity
    Player 2 (min) trying card ♦J
      α=87, β=Infinity
    Score for ♦J: >=88 - discarding
    Player 2 (min) trying card ♦K
      α=87, β=88
    Score for ♦K: 87
    Best: ♦K ♠A ♠9
  Score for ♠J: 87
  Cutoff at 87.
  Best: unknown (cutoff)
Score for ♦Q: <=87 - discarding
Player 3 (max) trying card ♦8
  α=87, β=Infinity
  Player 1 (min) trying card ♠J
    α=87, β=Infinity
    Player 2 (min) trying card ♦J
      α=87, β=Infinity
    Score for ♦J: >=91 - discarding
    Player 2 (min) trying card ♦K
      α=87, β=91
    Score for ♦K: 89
    Best: ♦K ♠A ♠9 ♥9 ♣K ♣10 ♥8 ♦J ♥J ♠K
  Score for ♠J: 89
  Best: ♠J ♦K ♠A ♠9 ♥9 ♣K ♣10 ♥8 ♦J ♥J ♠K
Score for ♦8: 89
Best: ♦8 ♠J ♦K ♠A ♠9 ♥9 ♣K ♣10 ♥8 ♦J ♥J ♠K
Total analysis time: 13.433s
```

`logDepth` can take values up to 30, but this produces **a lot** of ouptut.

## Feature list

- [x] Allows modeling color games
- [x] Allows modeling Null games
- [x] Allows modeling Grand games
- [x] Engine can analyze color games
  - [ ] Performance improvements
- [ ] Engine can analyze Grand games
- [ ] Engine can analyze Null games
- [ ] UI
  - [x] Prototype
    - [ ] Vue application rewrite
  - [x] Configurable design
  - [x] Spawn analysis engine as worker
  - [x] Mark mistakes in UI
  - [ ] Setup games
  - [ ] Undo/redo
  - [ ] Fork variation
  - [ ] Load/save games
  - [ ] i18n
  - [ ] Editable player names
