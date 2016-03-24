var GFX = require('./gfx');
var THREE = require('three');
var World = require('./world');
var Entity = require('./entity');
var Player = require('./player');
var Terrain = require('./terrain');
var Bullet = require('./bullet');
var ExplosionParticle = require('./explosionParticle');
var Drone = require('./drone');
var PotentialField = require('./potentialField');

function Game() {
  this.paused = false;
  this.lastTime = window.performance.now();


  this.field = new PotentialField();
  this.terrain = new Terrain();
  this.player = new Player(this.field);

  this.field.setup(this.player, Drone.all);

  for (var i = 0; i < 48; i++) {
    Drone.spawn(
        Math.random() * World.width,
        Math.random() * World.depth,
        0 | Math.pow(Math.random(), 3) * 8 + 1,
        this.field
        );
  }

  document.addEventListener("keydown", this.onKeyDown.bind(this), true);
  document.addEventListener("keyup", this.onKeyUp.bind(this), true);
  GFX.element.addEventListener("mousedown", this.onMouseDown.bind(this), true);
  GFX.element.addEventListener("mouseup", this.onMouseUp.bind(this), true);
  GFX.element.addEventListener("mousemove", this.onMouseMove.bind(this), true);
}

Game.prototype.update = function(dt) {
  dt /= 2;
  this.player.update(dt);
  Entity.updateAll(Bullet, dt);
  Entity.updateAll(Drone, dt);
  Entity.updateAll(ExplosionParticle, dt);

  this.field.update();

  Entity.collideAllWithBox(Bullet, Drone);
  Entity.collideAllWithSingleBox(Drone, this.player);

  Entity.cullAll(Bullet);
  Entity.cullAll(Drone);
  Entity.cullAll(ExplosionParticle);
};


Game.prototype.render = function() {
  if (!this.paused) {
    window.requestAnimationFrame(this.render.bind(this));
  }
  var currentTime = window.performance.now();
  var dt = (currentTime - this.lastTime) / 1000;
  this.lastTime = currentTime;

  this.update(dt);
  GFX.render();
};

Game.prototype.onMouseMove = function(e) {
  e.preventDefault();
  if (!document.pointerLockElement) {
    return false;
  } else {
    this.player.onMouseMove(e.movementX, e.movementY);
  }
};

Game.prototype.onMouseDown = function(e) {
  e.preventDefault();
  if (!document.pointerLockElement) {
    GFX.element.requestPointerLock();
  } else {
    this.player.onMouseDown(e.button);
  }
};

Game.prototype.onMouseUp = function(e) {
  e.preventDefault();
  if (!document.pointerLockElement) {
    return false;
  } else {
    this.player.onMouseUp(e.button);
  }
};

Game.prototype.onKeyDown = function(e) {
  e.preventDefault();
  this.player.onKeyDown(e.keyCode);
};

Game.prototype.onKeyUp = function(e) {
  e.preventDefault();
  this.player.onKeyUp(e.keyCode);
};

module.exports = Game;
