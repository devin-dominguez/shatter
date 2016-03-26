var THREE = require('three');
var GFX = require('../gfx');

var World = require('./world');

var Terrain = require('./terrain');
var PotentialField = require('./potentialField');

var Entity = require('./entities/entity');
var Player = require('./entities/player');
var Drone = require('./entities/drone');
var Bullet = require('./entities/bullet');
var ExplosionParticle = require('./entities/explosionParticle');

function Game() {

  this.field = new PotentialField();
  this.terrain = new Terrain();
  this.player = new Player(this.field);

  this.field.setup(this.player, Drone.all);

  for (var i = 0; i < 32; i++) {
    Drone.spawn(
        Math.random() * World.width,
        Math.random() * World.depth,
        0 | Math.pow(Math.random(), 1.5) * 8 + 1,
        this.field
        );
  }

}

Game.prototype.update = function(dt) {
  //dt /= 8;
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

  GFX.render();

  this.drawOverlay();
};

Game.prototype.drawOverlay = function(dt) {
};

Game.prototype.onMouseMove = function(x, y) {
  this.player.onMouseMove(x, y);
};

Game.prototype.onMouseDown = function(button) {
  this.player.onMouseDown(button);
};

Game.prototype.onMouseUp = function(button) {
  this.player.onMouseUp(button);
};

Game.prototype.onKeyDown = function(key) {
  this.player.onKeyDown(key);
};

Game.prototype.onKeyUp = function(key) {
  this.player.onKeyUp(key);
};

module.exports = Game;
