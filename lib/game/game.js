const THREE = require('three');
const GFX = require('../gfx');

const World = require('./world');
const GameData = require('./gameData');

const Terrain = require('./terrain');
const PotentialField = require('./potentialField');

const Entity = require('./entities/entity');
const Player = require('./entities/player');
const Drone = require('./entities/drone');
const Bullet = require('./entities/bullet');
const ExplosionParticle = require('./entities/explosionParticle');

function Game() {
  GameData.init();

  this.slow = false;
  this.slowFactor =  180;
  this.gameSpeed = 1;
  this.fov = 75;

  this.field = new PotentialField();
  this.terrain = new Terrain();
  this.player = new Player(this.field);

  this.field.setup(this.player, Drone.all);

  this.setupOverlay();

  this.spawnWave();
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
  GameData.update(dt, this.slow);

  if (this.slow) {
    this.fov = this.fov + 0.00125 * (179 - this.fov);
    this.gameSpeed = this.gameSpeed + 0.0005 * (this.slowFactor - this.gameSpeed);
  } else {
    this.fov = this.fov + 0.25 * (75 -  this.fov);
    this.gameSpeed = this.gameSpeed + 0.25 * (1.0 - this.gameSpeed);
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

  if (Drone.all.length <= this.numDrones * 0.666) {
    GameData.nextLevel();
    this.spawnWave();
  }

  var bgColor = new THREE.Color(World.bgColor);
  bgColor.lerp(new THREE.Color(World.deathColor), 1 - (GameData.health / 100));
  GFX.setBgColor(bgColor);

  if (GFX.camera.fov !== this.fov) {
    GFX.camera.fov = this.fov;
    GFX.camera.updateProjectionMatrix();
  }

  GFX.render();
  this.updateOverlay();
};

Game.prototype.spawnWave = function() {
  let level = GameData.level;
  this.numDrones = level * 2 + 6;
  let radius = 0.5 * Math.sqrt(Math.pow(World.width, 2) + Math.pow(World.depth, 2));

  for (let i = 0; i < this.numDrones; i++) {
    let angle = (i / this.numDrones) * Math.PI * 8;
    let offset = (i / this.numDrones) * radius * 2;
    let x = Math.cos(angle) * (radius + offset);
    x += World.width / 2;
    let z = Math.sin(angle) * (radius + offset);
    z += World.depth / 2;
    let droneLevel = Math.pow((i / this.numDrones), 12) * level;
    droneLevel = Math.floor(droneLevel) + 1;

    Drone.spawn(x, z, droneLevel, this.field);
  }
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
  if (key === 16) {
    this.slow = true;
  } else {
    this.player.onKeyDown(key);
  }
};

Game.prototype.onKeyUp = function(key) {
  if (key === 16) {
    this.slow = false;
  } else {
    this.player.onKeyUp(key);
  }
};

module.exports = Game;
