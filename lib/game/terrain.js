const THREE = require('three');
const GFX = require('../gfx');
const World = require('./world');

function Terrain() {
  this.setupObject();
}

Terrain.prototype.setupObject = function() {
  this.geometry = new THREE.Geometry();
  let tileWidth = World.width / World.numTiles;
  for (let x = 0; x <= World.numTiles; x++) {
    this.geometry.vertices.push(
        new THREE.Vector3(x * tileWidth, 0, 0),
        new THREE.Vector3(x * tileWidth, 0, World.depth),
        new THREE.Vector3(x * tileWidth, World.height, 0),
        new THREE.Vector3(x * tileWidth, World.height, World.depth),

        new THREE.Vector3(x * tileWidth, 0, 0),
        new THREE.Vector3(x * tileWidth, World.height, 0),
        new THREE.Vector3(x * tileWidth, 0, World.depth),
        new THREE.Vector3(x * tileWidth, World.height, World.depth)
        );
  }

  let tileDepth = World.depth / World.numTiles;
  for (let z = 0; z <= World.numTiles; z++) {
    this.geometry.vertices.push(
        new THREE.Vector3(0, 0, z * tileDepth),
        new THREE.Vector3(World.width, 0, z * tileDepth),
        new THREE.Vector3(0, World.height, z * tileDepth),
        new THREE.Vector3(World.width, World.height, z * tileDepth),

        new THREE.Vector3(0, 0, z * tileDepth),
        new THREE.Vector3(0, World.height, z * tileDepth),
        new THREE.Vector3(World.width, 0, z * tileDepth),
        new THREE.Vector3(World.width, World.height, z * tileDepth)
        );
  }

  this.material = new THREE.LineBasicMaterial({
    color: World.terrainColor
  });

  this.object = new THREE.LineSegments(this.geometry, this.material);

  GFX.scene.add(this.object);
};

Terrain.prototype.kill = function() {
  GFX.scene.remove(this.object);
};

module.exports = Terrain;
