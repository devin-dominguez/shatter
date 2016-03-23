var THREE = require('three');
var GFX = require('./gfx');
var World = require('./world');

var dotSpace = 4;
var gridSize = 64;

function Terrain() {
  this.geometry = new THREE.Geometry();
  for (var x = 0; x <= World.width; x++) {
    for (var z = 0; z <= World.depth; z++) {
      if ((x % gridSize === 0 && z % dotSpace === 0) ||
          (z % gridSize === 0 && x % dotSpace === 0)) {
        this.geometry.vertices.push(new THREE.Vector3(x, 0, z));
        this.geometry.vertices.push(new THREE.Vector3(x, World.height, z));
      }
    }
  }

  for (var x = 0; x <= World.width; x++) {
    for (var z = 0; z <= World.depth; z++) {
      if (x === 0 || x === World.width || z === 0 || z === World.depth) {
        for (var y = 0; y < World.height; y++) {
          if (y % dotSpace === 0 && (z % gridSize === 0 && x % gridSize === 0)) {
            this.geometry.vertices.push(new THREE.Vector3(x, y, z));
          }
        }
      }
    }
  }


  this.material = new THREE.PointsMaterial({sizeAttenuation: false});
  this.object = new THREE.Points(this.geometry, this.material);

  GFX.scene.add(this.object);
}

module.exports = Terrain;
