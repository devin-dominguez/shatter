const World = require('./world');

function taxicabDistance(x1, z1, x2, z2) {
  return Math.abs(x1 - x2) + Math.abs(z1 - z2);
}


class PotentialField {
  constructor () {
    this.field = [];

    this.width = World.numTiles * 4;
    this.depth = World.numTiles * 4;
  }

  setup(player, allDrones) {
    this.player = player;
    this.allDrones = allDrones;

    this.initField();
  }

  initField() {
    for (let x = 0; x < this.width; x++) {
      this.field[x] = [];
    }
  }

  update() {
    for (let x = 0; x < this.width; x++) {
      for (let z = 0; z < this.depth; z++) {
        this.field[x][z] = 0;
        let playerDistance = taxicabDistance(
            x, z,
            this.player.fieldX, this.player.fieldZ
            );

        playerDistance /= this.width * this.depth;
        playerDistance = 1 / playerDistance;
        this.field[x][z] -= playerDistance * this.allDrones.length;

        for (let droneIdx = 0; droneIdx < this.allDrones.length; droneIdx++) {
          let drone = this.allDrones[droneIdx];
          if (drone.inBounds) {
            let distance = taxicabDistance(
                x, z,
                drone.fieldX, drone.fieldZ
                );
            distance /= this.width + this.depth;
            distance = 1 / distance;
            this.field[x][z] += distance;
          }
        }

      }
    }
  }

}

module.exports = PotentialField;
