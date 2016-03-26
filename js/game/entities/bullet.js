var THREE = require('three');
var GFX = require('../../gfx');
var World = require('../world');

var Entity = require('./entity');

var ExplosionParticle = require('./explosionParticle');

var bulletRot = 0;

function Bullet(pos, rot) {
  this.collidable = true;
  this.speed = 700;

  this.setupObject(pos, rot);

  Entity.call(this);
}

Bullet.inherits(Entity);

Bullet.all = [];

Bullet.spawn = function(pos, rot) {
  Bullet.all.push(new Bullet(pos, rot));
};

Bullet.prototype.setupObject = function(pos, rot) {
  this.geometry = new THREE.Geometry();
  this.geometry.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(0), Math.sin(0), 8),
      new THREE.Vector3(Math.cos(2 * Math.PI / 3), Math.sin(2 * Math.PI / 3), 8),
      new THREE.Vector3(Math.cos(4 * Math.PI / 3), Math.sin(4 * Math.PI / 3), 8),
      new THREE.Vector3(0, 0, 10)
      );

  this.geometry.faces.push(
      new THREE.Face3(0, 1, 3),
      new THREE.Face3(0, 3, 2),
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(4, 1, 3),
      new THREE.Face3(4, 3, 2),
      new THREE.Face3(4, 2, 1)
      );

  this.material = new THREE.MeshBasicMaterial({
    color: World.bulletColor,
    wireframe: true
  });
  this.object = new THREE.Mesh(this.geometry, this.material);

  this.object.position.add(pos);
  this.object.rotation.setFromVector3(rot, "YXZ");
  this.object.rotation.z = bulletRot;
  bulletRot += Math.PI / 16;

  GFX.scene.add(this.object);
};

Bullet.prototype.update = function(dt) {
  this.object.translateZ(-this.speed * dt);
  this.object.rotation.z += Math.PI * 2 * dt;
  this.bBox.update();

  if (!this.isInBounds() && this.alive) {
    this.kill();
    this.explode();
  }
};

Bullet.prototype.collide = function(entity) {
  this.kill();
  this.explode();
};

Bullet.prototype.explode = function() {
  ExplosionParticle.explode(this.object);
};

Bullet.prototype.isInBounds = function() {
  var x = this.object.position.x;
  var y = this.object.position.y;
  var z = this.object.position.z;

  return x > 0 && x < World.width &&
    y > 0 && y < World.height &&
    z > 0 && z < World.depth;
};
module.exports = Bullet;
