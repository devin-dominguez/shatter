const THREE = require('three');
const GFX = require('../../gfx');
const World = require('../world');
const GameData = require('../gameData');

const Entity = require('./entity');
const Bullet = require('./bullet');

class Player extends Entity {
  constructor(field) {
    super();
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

    super.init();
  }

  setupObject() {
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
  }

  updateFieldPosition() {
    this.fieldX = 0 | (this.object.position.x / World.width) * this.field.width;
    this.fieldZ = 0 | (this.object.position.z / World.depth) * this.field.depth;
  }

  update(dt) {
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
  }

  move(dt) {
    this.vZ -= this.vZ * 10 * dt;
    this.vX -= this.vX * 10 * dt;

    if (this.moving.forwards) { this.vZ = -this.speed; }
    if (this.moving.backwards) { this.vZ = this.speed; }
    if (this.moving.left) { this.vX = -this.speed; }
    if (this.moving.right) { this.vX = this.speed; }

    this.object.translateZ(this.vZ * dt);
    this.object.translateX(this.vX * dt);
  }

  look(dt) {
    let lookX = this.dY * this.lookSpeed;
    let lookY = this.dX * this.lookSpeed;

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
  }

  shoot() {
    let pos = this.head.position.clone();
    pos.y *= 0.5;
    this.object.localToWorld(pos);

    let rot = new THREE.Vector3();
    rot.y = this.object.rotation.y;
    rot.x = this.head.rotation.x;
    Bullet.spawn(pos, rot);
  }

  constrainPosition() {
    this.object.position.x = Math.max(0, Math.min(
          World.width, this.object.position.x));
    this.object.position.z = Math.max(0, Math.min(
          World.depth, this.object.position.z));
  }

  collide(drone) {
    GameData.playerHit(drone.level);
  }

  onMouseDown(button) {
    switch (button) {
      case 0:
        this.firing = true;
        break;
    }
  }

  onMouseUp(button) {
    switch (button) {
      case 0:
        this.firing = false;
        break;
    }
  }

  onMouseMove(dX, dY) {
    this.dX = dX;
    this.dY = dY;
  }

  onKeyDown(key) {
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
  }

  onKeyUp(key) {
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
  }
}

module.exports = Player;
