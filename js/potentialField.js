function PotentialField() {
  this.field = [];

  this.width = 64;
  this.depth = 64;
}

PotentialField.prototype.setup = function(playerPos, allDrones) {
  this.playerPos = playerPos;
  this.allDrones = allDrones;

  this.initField();

};

PotentialField.prototype.initField = function() {
  for (var x = 0; x < this.width; x++) {
    this.field[x] = [];
    for (var z = 0; z < this.depth; z++) {
      this.field[x][z] = 0;
    }
  }
};

PotentialField.prototype.update = function() {
  
};

module.exports = PotentialField;
