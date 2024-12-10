# Skatalysator ♣️♠️♥️♦️

An analysis engine for the game of [Skat](https://en.wikipedia.org/wiki/Skat_(card_game)).

What this engine can do:

* Model entire games of Skat, including Null and Grand games
* Analyse games given full information
  * Does not work for Null games yet

What this engine can **not** do:
* Play without knowing the opponents' cards

This project is currently in development.


Feature list

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
