var GameData = require('./game/gameData');
var GFX = require('./gfx');

function DeathScreen() {
  GameData.bestScore = Math.max(GameData.currentScore, GameData.bestScore);
  this.setupOverlay();
}

DeathScreen.prototype.setupOverlay = function() {
  this.overlay = {};
  this.overlay.container = document.createElement("div");
  this.overlay.container.style.height = "100vh";
  this.overlay.container.style.display = "flex";
  this.overlay.container.style.flexDirection = "column";
  this.overlay.container.style.alignItems = "center";
  this.overlay.container.style.justifyContent = "center";

  this.overlay.gameOver = document.createElement("h1");
  this.overlay.gameOver.innerHTML = "GAME&nbsp;OVER";

  this.overlay.scoreContainer = document.createElement("div");

  this.overlay.score = document.createElement("small");
  this.overlay.score.innerHTML = "SCORE = " + GameData.currentScore.toFixed(0) + " ";

  this.overlay.best = document.createElement("small");
  this.overlay.best.innerHTML = "BEST = " + GameData.bestScore.toFixed(0);

  this.overlay.next = document.createElement("small");
  this.overlay.next.innerHTML = "CLICK to CONTINUE";

  this.overlay.scoreContainer.appendChild(this.overlay.score);
  this.overlay.scoreContainer.appendChild(this.overlay.best);
  this.overlay.container.appendChild(this.overlay.gameOver);
  this.overlay.container.appendChild(this.overlay.scoreContainer);
  this.overlay.container.appendChild(this.overlay.next);
  GFX.overlayElement.appendChild(this.overlay.container);
};

DeathScreen.prototype.end = function() {
  GFX.overlayElement.innerHTML = "";
};

module.exports = DeathScreen;
