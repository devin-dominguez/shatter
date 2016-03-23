var THREE = require('three');
var GFX = require('./gfx');

var Entity = require('./entity');

function ExplosionParticle() {

  this.maxSpeed = this.maxSpeed || 100;
  this.speed = this.maxSpeed;
  this.slowDown = this.slowDown || 100;
  this.rotSpeed = this.rotSpeed || 1;

  var directionAngle = new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      "XYZ"
      );
  this.direction = new THREE.Vector3(0, 0, 1);
  this.direction.applyEuler(directionAngle);

  this.rotAxis = new THREE.Vector3(
      Math.random(),
      Math.random(),
      Math.random()
      );

  Entity.call(this);
}

ExplosionParticle.inherits(Entity);

ExplosionParticle.all = [];

ExplosionParticle.explode = function(pos, particleClass, particleCount) {
  for (var i = 0; i < particleCount; i++) {
    ExplosionParticle.all.push(new particleClass(pos));
  }
}

ExplosionParticle.prototype.update = function(dt) {
  this.object.position.add(this.direction.clone().multiplyScalar(this.speed * dt));
  this.object.rotateOnAxis(this.rotAxis, Math.PI * 2  * this.rotSpeed * dt);

  this.speed -= this.slowDown * dt;

  this.material.opacity = this.speed / this.maxSpeed;

  if (this.speed <= 0) {
    this.kill();
  }
};

module.exports = ExplosionParticle;
