var THREE = require('three');
var GFX = require('../gfx');

var World = require('./world');
var GameData = require('./gameData');

var Terrain = require('./terrain');
var PotentialField = require('./potentialField');

var Entity = require('./entities/entity');
var Player = require('./entities/player');
var Drone = require('./entities/drone');
var Bullet = require('./entities/bullet');
var ExplosionParticle = require('./entities/explosionParticle');

function Game() {
  GameData.init();

  this.gameSpeed = 1;
  this.fov = 75;

  this.field = new PotentialField();
  this.terrain = new Terrain();
  this.player = new Player(this.field);

  this.field.setup(this.player, Drone.all);

  this.setupOverlay();

  for (var i = 0; i < 12; i++) {
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
  if (GameData.slow) {
    this.fov = this.fov + 0.004 * (179 -  this.fov);
    this.gameSpeed = this.gameSpeed + 0.01 * (GameData.slowFactor - this.gameSpeed);
  } else {
    this.fov = this.fov + 0.25 * (75 -  this.fov);
    this.gameSpeed = this.gameSpeed + 0.1 * (1.0 - this.gameSpeed);
  }

  dt /= this.gameSpeed;
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

  var bgColor = new THREE.Color(World.bgColor);
  bgColor.lerp(new THREE.Color(World.deathColor), 1 - (GameData.health / 100));
  GFX.setBgColor(bgColor);

  if (GFX.camera.fov !== this.fov) {
    GFX.camera.fov = this.fov;
    GFX.camera.updateProjectionMatrix();
  }

  GFX.render();
  this.updateOverlay();

  GameData.update(dt);
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
  this.overlay.barContainer.style.border = "1px solid black";
  this.overlay.barContainer.style.display = "flex";
  this.overlay.barContainer.style.alignItems = "center";

  this.overlay.bar = document.createElement("div");
  this.overlay.bar.style.width = "100%";
  this.overlay.bar.style.height = "15px";
  this.overlay.bar.style.margin = " 0 5px";
  this.overlay.bar.style.backgroundColor = "black";

  this.overlay.barContainer.appendChild(this.overlay.bar);
  this.overlay.container.appendChild(this.overlay.barContainer);
  GFX.overlayElement.appendChild(this.overlay.container);
};

Game.prototype.updateOverlay = function() {
  this.overlay.bar.style.width = GameData.health + "%";
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
  if (key === 32) {
    GameData.slow = true;
  } else {
    this.player.onKeyDown(key);
  }
};

Game.prototype.onKeyUp = function(key) {
  if (key === 32) {
    GameData.slow = false;
  } else {
    this.player.onKeyUp(key);
  }
};

module.exports = Game;
