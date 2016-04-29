const GFX = require('../../gfx');
const THREE = require('three');

function Entity() {
  this.alive = true;

  if (this.collidable) {
    this.bBox = new THREE.BoundingBoxHelper(this.object);
    this.bBox.update();
  }
}

Entity.prototype.kill = function() {
  this.alive = false;
  GFX.scene.remove(this.object);
};

Entity.prototype.isCollidingWithBox = function(otherEntity) {
  return this.collidable && otherEntity.collidable &&
    this.bBox.box.intersectsBox(otherEntity.bBox.box);
};

Entity.prototype.isCollidingWithPoint = function(otherEntity) {
  return this.collidable && otherEntity.collidable &&
    this.bBox.box.containsPoint(otherEntity.object.position);
};

Entity.killAll = function(entities) {
  for (let i = 0; i < entities.all.length; i++) {
    entities.all[i].kill();
  }
};

Entity.updateAll = function(entities, dt) {
  for (let i = 0; i < entities.all.length; i++) {
    entities.all[i].update(dt);
  }
};

Entity.cullAll = function(entities) {
  let culled = [];
  for (let i = 0; i < entities.all.length; i++) {
    if (entities.all[i].alive) {
      culled.push(entities.all[i]);
    }
  }
  entities.all = culled;
};

Entity.collideAllWithSingleBox = function(entitiesA, entityB) {
  for (let i = 0; i < entitiesA.all.length; i++) {
    let entityA = entitiesA.all[i];
    if (entityA.isCollidingWithBox(entityB)) {
      entityA.collide(entityB);
      entityB.collide(entityA);
    }
  }
};

Entity.collideAllWithBox = function(entitiesA, entitiesB) {
  for (let a = 0; a < entitiesA.all.length; a++) {
    for (let b = 0; b < entitiesB.all.length; b++) {
      let entityA = entitiesA.all[a];
      let entityB = entitiesB.all[b];
      if (entityA.isCollidingWithBox(entityB)) {
        entityA.collide(entityB);
        entityB.collide(entityA);
      }
    }
  }
};

module.exports = Entity;
