var THREE = require('three');
var GFX = require('./gfx');
var World = require('./world');

var Entity = require('./entity');
var Bullet = require('./bullet');

function Player(field) {
  this.field = field;
  this.fieldX = 0;
  this.fieldZ = 0;

  this.collidable = true;
  this.speed = 250;
  this.height = 32;

  this.setupObject();

  this.moving = {};

  this.vZ = 0;
  this.vX = 0;

  this.dX = 0;
  this.dY = 0;

  this.fireRate = 9;
  this.fireDelay = 1;
  this.firing = false;

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

  this.object.position.set(World.width / 2, 0, World.depth / 2);
  this.head.position.set(0, this.height, 0);

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
  this.head.rotation.x -= this.dY * 0.1 * dt;
  this.object.rotation.y -= this.dX * 0.1 * dt;

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

Player.prototype.collide = function(otherEntity) {
  
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
  }
};

module.exports = Player;
