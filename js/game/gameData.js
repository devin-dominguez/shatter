var GameData = {};
GameData.bestScore = 0;
GameData.slowFactor = 8;

GameData.init = function() {
  this.slow = false;
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

GameData.update = function(dt) {
  var drain = 1 + this.level * 0.0625;
  if (this.slow) {
    this.health -= drain * dt * Math.pow(GameData.slowFactor, 2) * 0.125;
  } else {
    this.health -= drain * dt;
  }
  this.health = Math.max(0, Math.min(100, this.health));
  if (this.health === 0) {
    this.done = true;
  }
};

GameData.nextLevel = function() {
  this.level++;
};

module.exports = GameData;
