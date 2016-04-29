const GFX = require('./gfx');
const Title = require('./title');
const Game = require('./game/game');
const DeathScreen = require('./death');
const GameData = require('./game/gameData');

function App() {
  this.lastTime = window.performance.now();

  document.addEventListener("keydown", this.onKeyDown.bind(this), true);
  document.addEventListener("keyup", this.onKeyUp.bind(this), true);
  document.addEventListener("mousedown", this.onMouseDown.bind(this), true);
  document.addEventListener("mouseup", this.onMouseUp.bind(this), true);
  GFX.element.addEventListener("mousemove", this.onMouseMove.bind(this), true);

  this.setState("TITLE");
  GameData.init();
  GFX.render();
}

App.prototype.setState = function(state) {
  // leave current state
  switch (this.state) {
    case "GAMEPLAY":
      this.game.end();
      delete this.game;
      document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
      document.exitPointerLock();
      break;

    case "DEATH":
      this.death.end();
      delete this.death;
      break;

    case "TITLE":
      this.title.end();
      delete this.title;
      break;
  }

  // enter new state
  this.state = state;
  switch (this.state) {
    case "GAMEPLAY":
      this.game = new Game();
      break;

    case "DEATH":
      this.death = new DeathScreen();
      break;

    case "TITLE":
      this.title = new Title();
      break;
  }
};

App.prototype.update = function() {
  window.requestAnimationFrame(this.update.bind(this));
  const currentTime = window.performance.now();
  const dt = (currentTime - this.lastTime) / 1000;
  this.lastTime = currentTime;

  switch (this.state) {
    case "GAMEPLAY":
      this.game.update(dt);
      if (GameData.done) {
        this.setState("DEATH");
      }
      break;
  }
};

App.prototype.onMouseMove = function(e) {
  e.preventDefault();
  if (document.pointerLockElement || document.mozPointerLockElement) {
    switch (this.state) {
      case "GAMEPLAY":
        this.game.onMouseMove(e.movementX, e.movementY);
        break;
    }
  } else {
    return false;
  }
};

App.prototype.onMouseDown = function(e) {
  e.preventDefault();
  switch (this.state) {
    case "TITLE":
      if (!document.pointerLockElement || !document.mozPointerLockElement) {
        GFX.element.requestPointerLock();
      }
      this.setState("GAMEPLAY");
      break;

    case "GAMEPLAY":
      if (!document.pointerLockElement || !document.mozPointerLockElement) {
        GFX.element.requestPointerLock();
      }
      this.game.onMouseDown(e.button);
      break;

    case "DEATH":
      this.setState("TITLE");
      break;
  }
};

App.prototype.onMouseUp = function(e) {
  e.preventDefault();
  if (document.pointerLockElement || document.mozPointerLockElement) {
    switch (this.state) {
      case "GAMEPLAY":
        this.game.onMouseUp(e.button);
        break;
    }
  } else {
    return false;
  }
};

App.prototype.onKeyDown = function(e) {
  e.preventDefault();
  switch (this.state) {
    case "GAMEPLAY":
      this.game.onKeyDown(e.keyCode);
      break;
  }
};

App.prototype.onKeyUp = function(e) {
  e.preventDefault();
  switch (this.state) {
    case "GAMEPLAY":
      this.game.onKeyUp(e.keyCode);
      break;
  }
};

module.exports = App;
