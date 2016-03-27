var World = require('./world');

function taxicabDistance(x1, z1, x2, z2) {
  return Math.abs(x1 - x2) + Math.abs(z1 - z2);
}


function PotentialField() {
  this.field = [];

  this.width = World.numTiles * 3;
  this.depth = World.numTiles * 3;
}

PotentialField.prototype.setup = function(player, allDrones) {
  this.player = player;
  this.allDrones = allDrones;

  this.initField();
};

PotentialField.prototype.initField = function() {
  for (var x = 0; x < this.width; x++) {
    this.field[x] = [];
  }
};

PotentialField.prototype.update = function() {
  for (var x = 0; x < this.width; x++) {
    for (var z = 0; z < this.depth; z++) {
      this.field[x][z] = 0;
      var playerDistance = taxicabDistance(
          x, z,
          this.player.fieldX, this.player.fieldZ
          );

      playerDistance /= this.width * this.depth;
      playerDistance = 1 / playerDistance;
      this.field[x][z] -= playerDistance * 48;

      for (var droneIdx = 0; droneIdx < this.allDrones.length; droneIdx++) {
        var distance = taxicabDistance(
            x, z,
            this.allDrones[droneIdx].fieldX, this.allDrones[droneIdx].fieldZ
            );
        distance /= this.width * this.depth;
        distance = 1 / distance;
        this.field[x][z] += distance;
      }
    }
  }

  this.allDrones.forEach(function(drone) {

  }, this);


};

module.exports = PotentialField;
