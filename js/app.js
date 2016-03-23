var Util = require('./util');
var GFX = require('./gfx');
var Game = require('./game');

window.addEventListener("load", function(e) {
  var game = new Game();
  game.render();
});
