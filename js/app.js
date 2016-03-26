var GFX = require('./gfx');
var Game = require('./game/game');

function App() {
  this.state = "GAMEPLAY";
  this.lastTime = window.performance.now();

  document.addEventListener("keydown", this.onKeyDown.bind(this), true);
  document.addEventListener("keyup", this.onKeyUp.bind(this), true);
  GFX.element.addEventListener("mousedown", this.onMouseDown.bind(this), true);
  GFX.element.addEventListener("mouseup", this.onMouseUp.bind(this), true);
  GFX.element.addEventListener("mousemove", this.onMouseMove.bind(this), true);

  this.game = new Game();
}

App.prototype.render = function() {
  window.requestAnimationFrame(this.render.bind(this));
  var currentTime = window.performance.now();
  var dt = (currentTime - this.lastTime) / 1000;
  this.lastTime = currentTime;

  switch (this.state) {
    case "GAMEPLAY":
      this.game.update(dt);
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
