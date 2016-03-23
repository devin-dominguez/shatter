var THREE = require('three');
var World = require('./world');
var GFX = require('./gfx');

var ExplosionParticle = require('./explosionParticle');

var size = 1.25;
var particleCount = 4;


function BulletParticle(pos) {
  this.rotSpeed = 0.75;

  ExplosionParticle.call(this);
  this.setupObject(pos);
}

BulletParticle.inherits(ExplosionParticle);

BulletParticle.prototype.setupObject = function(pos) {
  this.geometry = new THREE.Geometry();
  this.geometry.vertices.push(
      new THREE.Vector3(Math.cos(0) * size, Math.sin(0) * size, 0),
      new THREE.Vector3(Math.cos(2 * Math.PI / 3) * size, Math.sin(2 * Math.PI / 3) * size, 0),
      new THREE.Vector3(Math.cos(4 * Math.PI / 3) * size, Math.sin(4 * Math.PI / 3) * size, 0)
      );

  this.geometry.faces.push(
      new THREE.Face3(0, 1, 2)
      );

  this.material = new THREE.MeshBasicMaterial({
    color: World.bulletColor,
    transparent: true,
    wireframe: true
  });

  this.object = new THREE.Mesh(this.geometry, this.material);

  this.object.position.add(pos);
  this.object.rotateOnAxis(this.rotAxis, Math.PI * 2  * Math.random());

  GFX.scene.add(this.object);
};

BulletParticle.explode = function(pos) {
  ExplosionParticle.explode(pos, BulletParticle, particleCount);
};

module.exports = BulletParticle;
