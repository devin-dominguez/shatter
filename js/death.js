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

  this.overlay.score = document.createElement("span");
  this.overlay.score.innerHTML = "TIME = " + GameData.currentScore.toFixed(2) + " ";

  this.overlay.best = document.createElement("span");
  this.overlay.best.innerHTML = "BEST = " + GameData.bestScore.toFixed(2);

  this.overlay.next = document.createElement("span");
  this.overlay.next.innerHTML = "PRESS ENTER TO CONTINUE";

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
