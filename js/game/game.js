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
  this.score = 0;
  this.level = 1;

  this.field = new PotentialField();
  this.terrain = new Terrain();
  this.player = new Player(this.field);

  this.field.setup(this.player, Drone.all);

  this.setupOverlay();

  for (var i = 0; i < 32; i++) {
    Drone.spawn(
        Math.random() * World.width,
        Math.random() * World.depth,
        0 | Math.pow(Math.random(), 1.5) * 8 + 1,
        this.field
        );
  }

}

Game.prototype.end = function() {
  this.player.kill();
  this.terrain.kill();
  Entity.killAll(Drone);
  Entity.killAll(Bullet);
  Entity.killAll(ExplosionParticle);

  GFX.overlayElement.innerHTML = "";
  GFX.render();
};

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

  this.updateOverlay();
};

Game.prototype.setupOverlay = function() {
  this.overlay = {};
  this.overlay.container = document.createElement("div");
  this.overlay.container.style.width = "100%";
  this.overlay.container.style.display = "flex";

  this.overlay.barContainer = document.createElement("div");
  this.overlay.barContainer.style.width = "100%";
  this.overlay.barContainer.style.margin = "20px";
  this.overlay.barContainer.style.height = "25px";
  this.overlay.barContainer.style.border = "1px solid white";
  this.overlay.barContainer.style.display = "flex";
  this.overlay.barContainer.style.alignItems = "center";

  this.overlay.bar = document.createElement("div");
  this.overlay.bar.style.width = "100%";
  this.overlay.bar.style.height = "15px";
  this.overlay.bar.style.margin = " 0 5px";
  this.overlay.bar.style.backgroundColor = "white";

  this.overlay.barContainer.appendChild(this.overlay.bar);
  this.overlay.container.appendChild(this.overlay.barContainer);
  GFX.overlayElement.appendChild(this.overlay.container);
};

Game.prototype.updateOverlay = function() {
  this.overlay.bar.style.width = this.player.health + "%";
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
