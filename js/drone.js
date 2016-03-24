var THREE = require('three');
var GFX = require('./gfx');
var World = require('./world');

var Entity = require('./entity');
var Bullet = require('./bullet');
var DroneParticle = require('./droneParticle');

var maxHealth = 12;
var maxLevel = 8;

var maxSpeed = 96;
var rotRate = 0.05;
var targetAngle = Math.PI / 4;

function Drone(x, z, level, field) {
  this.field = field;
  this.fieldX = 0;
  this.fieldZ = 0;

  this.targetX = 0;
  this.targetZ = 0;
  this.rot = 0;

  this.level = level;
  this.collidable = true;
  this.coreRotSpeed = Math.PI / 2.0;
  this.startingHealth = (this.level / maxLevel) * maxHealth;
  this.health = this.startingHealth;
  this.regenRate = 1;

  this.speed = maxSpeed;

  this.setupObject(x, z);

  Entity.call(this);
}

Drone.inherits(Entity);

Drone.all = [];

Drone.spawn = function(x, z, level, field) {
  Drone.all.push(new Drone(x, z, level, field));
};

Drone.prototype.setupObject = function(x, z) {
  this.geometry = new THREE.IcosahedronGeometry(World.height * 0.4, 0);
  this.material = new THREE.MeshBasicMaterial({
    color: World.droneColor,
    wireframe: true
  });

  this.object = new THREE.Mesh(this.geometry, this.material);

  this.coreGeometry = new THREE.IcosahedronGeometry(World.height * 0.3, 0);
  this.coreMaterial = new THREE.MeshBasicMaterial({
    color: World.coreColor,
    transparent: true
  });

  this.coreMaterial.opacity = 0.8;

  this.core = new THREE.Mesh(this.coreGeometry, this.coreMaterial);
  this.object.add(this.core);

  //this.stickGeometry = new THREE.BoxGeometry(1, 1, 60);
  //this.stick = new THREE.Mesh(this.stickGeometry, this.coreMaterial);
  //this.stick.position.z = 30;
  //this.object.add(this.stick);

  this.object.position.x = x;
  this.object.position.y = World.height * 0.5;
  this.object.position.z = z;

  this.updateFieldPosition();

  GFX.scene.add(this.object);
};

Drone.prototype.findTargetPosition = function() {
  var bestVal;
  var fieldTargetX = 0;
  var fieldTargetZ = 0;

  for (var x = -1; x <= 1; x++) {
    for (var z = -1; z <= 1; z++) {
      var fX = Math.max(0, Math.min(this.fieldX + x, this.field.width - 1));
      var fZ = Math.max(0, Math.min(this.fieldZ + z, this.field.depth - 1));

      if (!bestVal || this.field.field[fX][fZ] < bestVal) {
        bestVal = this.field.field[fX][fZ];
        fieldTargetX = fX;
        fieldTargetZ = fZ;
      }
    }
  }

  this.targetX = (fieldTargetX / this.field.width) * World.width;
  this.targetZ = (fieldTargetZ / this.field.depth) * World.depth;
};

Drone.prototype.rotate = function() {
  var currentAngle = this.object.rotation.y;
  var angleToTarget = Math.atan2(
      this.targetZ - this.object.position.z,
      this.targetX - this.object.position.x
      );

  var targetAngle = Math.PI / 2 - angleToTarget;

  currentAngle = (currentAngle + Math.PI * 2) % (Math.PI * 2);
  targetAngle = (targetAngle + Math.PI * 2) % (Math.PI * 2);
  var diff = Math.abs(currentAngle - targetAngle);
  if (diff >= Math.PI) {
    if (currentAngle > targetAngle) {
      currentAngle -= Math.PI * 2;
    } else {
      targetAngle -= Math.PI * 2;
    }
  }

  this.object.rotation.y = currentAngle + rotRate * (targetAngle - currentAngle);
  this.canMove = Math.abs(currentAngle - targetAngle) < targetAngle / 2;
};

Drone.prototype.updateFieldPosition = function() {
  this.fieldX = 0 | (this.object.position.x / World.width) * this.field.width;
  this.fieldZ = 0 | (this.object.position.z / World.depth) * this.field.depth;
};

Drone.prototype.update = function(dt) {
  this.findTargetPosition();
  this.rotate();
  this.object.translateZ(this.speed * dt);


  this.updateFieldPosition();
  this.bBox.update();

  this.core.rotation.y += this.coreRotSpeed * dt;
  this.health += this.regenRate * dt;
  this.health = Math.min(this.startingHealth, this.health);

  if (this.health <= 0) {
    this.kill();
    this.explode();
  }

  this.core.scale.x = Math.max(0.001, this.health / maxHealth);
  this.core.scale.y = Math.max(0.001, this.health / maxHealth);
  this.core.scale.z = Math.max(0.001, this.health / maxHealth);
};

Drone.prototype.collide = function(entity) {
  if (entity instanceof Bullet) {
    this.health -= 1;
  }
};

Drone.prototype.explode = function() {
  DroneParticle.explode(this.object.position);
};

module.exports = Drone;
