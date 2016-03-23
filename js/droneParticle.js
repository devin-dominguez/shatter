var THREE = require('three');
var World = require('./world');
var GFX = require('./gfx');

var ExplosionParticle = require('./explosionParticle');

var size = 8;
var particleCount = 20;

function DroneParticle(pos) {
  this.maxSpeed = 100;
  this.slowDown = 15;
  this.rotSpeed = 0.5;

  ExplosionParticle.call(this);
  this.setupObject(pos);
}

DroneParticle.inherits(ExplosionParticle);

DroneParticle.prototype.setupObject = function(pos) {
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
    color: World.droneColor,
    transparent: true,
    wireframe: true
  });

  this.object = new THREE.Mesh(this.geometry, this.material);

  this.object.position.add(pos);
  this.object.rotateOnAxis(this.rotAxis, Math.PI * 2  * Math.random());

  GFX.scene.add(this.object);
};

DroneParticle.explode = function(pos) {
  ExplosionParticle.explode(pos, DroneParticle, particleCount);
};

module.exports = DroneParticle;
