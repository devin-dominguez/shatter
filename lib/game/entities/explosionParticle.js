const THREE = require('three');
const GFX = require('../../gfx');

const Entity = require('./entity');

function ExplosionParticle(object) {
  this.object = object;
  this.material = object.material;

  GFX.scene.add(this.object);

  this.maxSpeed = 150;
  this.speed = this.maxSpeed;
  this.slowDown = 10;
  this.rotSpeed = Math.random();

  let directionAngle = new THREE.Euler(
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

ExplosionParticle.explode = function(object) {
  let material = object.material.clone();
  material.transparent = true;

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let geometry = new THREE.Geometry();
    let v0 = object.geometry.vertices[face.a].clone();
    let v1 = object.geometry.vertices[face.b].clone();
    let v2 = object.geometry.vertices[face.c].clone();

    geometry.vertices.push(v0, v1, v2);
    geometry.faces.push(new THREE.Face3(0, 1, 2));

    let triangle = new THREE.Triangle(v0, v1, v2);
    let center = new THREE.Vector3();
    triangle.midpoint(center);
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation(
          -center.x,
          -center.y,
          -center.z)
        );

    let particle = new THREE.Mesh(geometry, material);
    particle.rotation.copy(object.rotation);
    particle.position.add(object.position);
    center.applyEuler(object.rotation, "XYZ");
    particle.position.add(center);

    ExplosionParticle.all.push(new ExplosionParticle(particle));
  }
};

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
