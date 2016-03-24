var GFX = require('./gfx');
var THREE = require('three');

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


Entity.updateAll = function(entities, dt) {
  entities.all.forEach(function(entity) {
    entity.update(dt);
  });
};

Entity.cullAll = function(entities) {
  entities.all = entities.all.filter(function(entity) {
    return entity.alive;
  });
};

Entity.collideAllWithSingleBox = function(entitiesA, entityB) {
  entitiesA.all.forEach(function(entityA) {
    if (entityA.isCollidingWithBox(entityB)) {
      entityA.collide(entityB);
      entityB.collide(entityA);
    }
  });
};

Entity.collideAllWithBox = function(entitiesA, entitiesB) {
  entitiesA.all.forEach(function(entityA) {
    entitiesB.all.forEach(function(entityB) {
      if (entityA.isCollidingWithBox(entityB)) {
        entityA.collide(entityB);
        entityB.collide(entityA);
      }
    });
  });
};

module.exports = Entity;
