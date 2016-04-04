var THREE = require('three');
var GFX = require('../../gfx');
var World = require('../world');

var GameData = require('../gameData');

var Entity = require('./entity');
var Bullet = require('./bullet');

function Player(field) {
  this.field = field;
  this.collidable = true;
  this.speed = 280;
  this.height = 32;
  this.fireRate = 9;

  this.health = 100;
  this.vZ = 0;
  this.vX = 0;

  this.dX = 0;
  this.dY = 0;
  this.lookSpeed = 0.002;

  this.fireDelay = 1;
  this.firing = false;
  this.moving = {};
  this.looking = {};

  this.setupObject();

  Entity.call(this);
}

Player.inherits(Entity);

Player.prototype.setupObject = function() {
  this.geometry = new THREE.BoxGeometry(
      World.height / 8,
      World.height,
      World.height / 8
      );

  this.material = new THREE.MeshBasicMaterial({visible: false});

  this.object = new THREE.Mesh(this.geometry, this.material);
  this.head = new THREE.Object3D();

  this.head.add(GFX.camera);
  this.object.add(this.head);

  this.head.position.set(0, this.height, 0);

  this.object.position.set(World.width / 2, 0, World.depth / 2);

  this.fieldX = 0;
  this.fieldZ = 0;
  this.updateFieldPosition();

  GFX.scene.add(this.object);
};

Player.prototype.updateFieldPosition = function() {
  this.fieldX = 0 | (this.object.position.x / World.width) * this.field.width;
  this.fieldZ = 0 | (this.object.position.z / World.depth) * this.field.depth;
};

Player.prototype.update = function(dt) {
  this.look(dt);
  this.move(dt);
  this.constrainPosition();

  this.bBox.update();

  this.updateFieldPosition();

  this.fireDelay -= dt * this.fireRate;

  if (this.firing && this.fireDelay <= 0) {
    this.shoot();
    this.fireDelay = 1;
  }
};

Player.prototype.move = function(dt) {
  this.vZ -= this.vZ * 10 * dt;
  this.vX -= this.vX * 10 * dt;

  if (this.moving.forwards) { this.vZ = -this.speed; }
  if (this.moving.backwards) { this.vZ = this.speed; }
  if (this.moving.left) { this.vX = -this.speed; }
  if (this.moving.right) { this.vX = this.speed; }

  this.object.translateZ(this.vZ * dt);
  this.object.translateX(this.vX * dt);
};

Player.prototype.look = function(dt) {
  var lookX = this.dY * this.lookSpeed;
  var lookY = this.dX * this.lookSpeed;

  if (this.looking.up) { lookX += -this.lookSpeed * 10; }
  if (this.looking.down) { lookX += this.lookSpeed * 10; }
  if (this.looking.left) { lookY += -this.lookSpeed * 30; }
  if (this.looking.right) { lookY += this.lookSpeed * 30; }

  this.head.rotation.x -= lookX;
  this.object.rotation.y -= lookY;

  this.head.rotation.x = Math.max(-Math.PI / 6,
      Math.min( Math.PI / 6, this.head.rotation.x));

  this.dX = 0;
  this.dY = 0;
};

Player.prototype.shoot = function() {
  var pos = this.head.position.clone();
  pos.y *= 0.5;
  this.object.localToWorld(pos);

  var rot = new THREE.Vector3();
  rot.y = this.object.rotation.y;
  rot.x = this.head.rotation.x;
  Bullet.spawn(pos, rot);
};

Player.prototype.constrainPosition = function() {
  this.object.position.x = Math.max(0, Math.min(
        World.width, this.object.position.x));
  this.object.position.z = Math.max(0, Math.min(
        World.depth, this.object.position.z));
};

Player.prototype.collide = function(drone) {
  GameData.playerHit(drone.level);
};

Player.prototype.onMouseDown = function(button) {
  switch (button) {
    case 0:
      this.firing = true;
      break;
  }
};

Player.prototype.onMouseUp = function(button) {
  switch (button) {
    case 0:
      this.firing = false;
      break;
  }
};

Player.prototype.onMouseMove = function(dX, dY) {
  this.dX = dX;
  this.dY = dY;
};

Player.prototype.onKeyDown = function(key) {
  switch (key) {
    case 87:
      this.moving.forwards = true;
      break;
    case 83:
      this.moving.backwards = true;
      break;
    case 65:
      this.moving.left = true;
      break;
    case 68:
      this.moving.right = true;
      break;

    case 38:
      this.looking.up = true;
      break;
    case 40:
      this.looking.down = true;
      break;
    case 37:
      this.looking.left = true;
      break;
    case 39:
      this.looking.right = true;
      break;

    case 32:
      this.firing = true;
      break;
  }
};

Player.prototype.onKeyUp = function(key) {
  switch (key) {
    case 87:
      this.moving.forwards = false;
      break;
    case 83:
      this.moving.backwards = false;
      break;
    case 65:
      this.moving.left = false;
      break;
    case 68:
      this.moving.right = false;
      break;

    case 38:
      this.looking.up = false;
      break;
    case 40:
      this.looking.down = false;
      break;
    case 37:
      this.looking.left = false;
      break;
    case 39:
      this.looking.right = false;
      break;

    case 32:
      this.firing = false;
      break;
  }
};

module.exports = Player;