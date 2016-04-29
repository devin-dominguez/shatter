const GameData = {};
GameData.bestScore = 0;

GameData.init = function() {
  this.done = false;
  this.health = 100;
  this.currentScore = 0;
  this.level = 1;
};

GameData.droneDestroyed = function(droneLevel) {
  this.health += droneLevel * 0.75;
};

GameData.playerHit = function(droneLevel) {
  this.health -= 16 + droneLevel * 2;
};

GameData.update = function(dt, slow) {
  if (!slow) {
    this.currentScore += 0 | (Math.pow(2, this.level / 5) * dt * 10000);
  }
  let drain = 1 + this.level * 0.03125;
  this.health -= drain * dt;
  this.health = Math.max(0, Math.min(100, this.health));
  if (this.health === 0) {
    this.done = true;
  }
};

GameData.nextLevel = function() {
  this.level++;
};

module.exports = GameData;
