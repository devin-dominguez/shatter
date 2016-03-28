var GFX = require('./gfx');
var Title = require('./title');
var Game = require('./game/game');
var DeathScreen = require('./death');
var GameData = require('./game/gameData');


function App() {
  this.lastTime = window.performance.now();

  document.addEventListener("keydown", this.onKeyDown.bind(this), true);
  document.addEventListener("keyup", this.onKeyUp.bind(this), true);
  GFX.element.addEventListener("mousedown", this.onMouseDown.bind(this), true);
  GFX.element.addEventListener("mouseup", this.onMouseUp.bind(this), true);
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
  var currentTime = window.performance.now();
  var dt = (currentTime - this.lastTime) / 1000;
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
  if (!document.pointerLockElement) {
    return false;
  } else {
    switch (this.state) {
      case "GAMEPLAY":
        this.game.onMouseMove(e.movementX, e.movementY);
        break;
    }
  }
};

App.prototype.onMouseDown = function(e) {
  e.preventDefault();
  if (!document.pointerLockElement) {
    GFX.element.requestPointerLock();
  } else {
    switch (this.state) {
      case "GAMEPLAY":
        this.game.onMouseDown(e.button);
        break;
    }
  }
};

App.prototype.onMouseUp = function(e) {
  e.preventDefault();
  if (!document.pointerLockElement) {
    return false;
  } else {
    switch (this.state) {
      case "GAMEPLAY":
        this.game.onMouseUp(e.button);
        break;
    }
  }
};

App.prototype.onKeyDown = function(e) {
  e.preventDefault();
  switch (this.state) {
    case "GAMEPLAY":
      this.game.onKeyDown(e.keyCode);
      break;
    case "DEATH":
      if (e.keyCode === 13) {
        this.setState("TITLE");
      }
      break;
    case "TITLE":
      if (e.keyCode === 13) {
        this.setState("GAMEPLAY");
      }
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
