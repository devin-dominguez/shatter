const GFX = require('../../gfx');
const THREE = require('three');

class Entity {
  constructor() {
    this.alive = true;
  }

  init() {
    if (this.collidable) {
      this.bBox = new THREE.BoundingBoxHelper(this.object);
      this.bBox.update();
    }
  }

  kill() {
    this.alive = false;
    GFX.scene.remove(this.object);
  }

  isCollidingWithBox(otherEntity) {
    return this.collidable && otherEntity.collidable &&
      this.bBox.box.intersectsBox(otherEntity.bBox.box);
  }

  isCollidingWithPoint(otherEntity) {
    return this.collidable && otherEntity.collidable &&
      this.bBox.box.containsPoint(otherEntity.object.position);
  }

  static killAll(entities) {
    for (let i = 0; i < entities.all.length; i++) {
      entities.all[i].kill();
    }
  }

  static updateAll(entities, dt) {
    for (let i = 0; i < entities.all.length; i++) {
      entities.all[i].update(dt);
    }
  }

  static cullAll(entities) {
    let culled = [];
    for (let i = 0; i < entities.all.length; i++) {
      if (entities.all[i].alive) {
        culled.push(entities.all[i]);
      }
    }
    entities.all = culled;
  }

  static collideAllWithSingleBox(entitiesA, entityB) {
    for (let i = 0; i < entitiesA.all.length; i++) {
      let entityA = entitiesA.all[i];
      if (entityA.isCollidingWithBox(entityB)) {
        entityA.collide(entityB);
        entityB.collide(entityA);
      }
    }
  }

  static collideAllWithBox(entitiesA, entitiesB) {
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
  }
}

module.exports = Entity;
