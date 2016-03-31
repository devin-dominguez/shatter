var GFX = require('./gfx');

function Title() {
  GFX.setBgColor(0x8888cc);
  GFX.render();
  this.setupOverlay();
}

Title.prototype.setupOverlay = function() {
  this.overlay = {};
  this.overlay.container = document.createElement("div");
  this.overlay.container.style.height = "100vh";
  this.overlay.container.style.display = "flex";
  this.overlay.container.style.flexDirection = "column";
  this.overlay.container.style.alignItems = "center";
  this.overlay.container.style.justifyContent = "center";

  this.overlay.title = document.createElement("h1");
  this.overlay.title.innerHTML = "SHATTER";

  this.overlay.instructions = document.createElement("div");
  this.overlay.instructions.style.display = "flex";
  this.overlay.instructions.style.flexDirection = "column";

  this.overlay.move = document.createElement("small");
  this.overlay.move.innerHTML = "MOVE = WASD";

  this.overlay.look = document.createElement("small");
  this.overlay.look.innerHTML = "LOOK = MOUSE or ARROW_KEYS";

  this.overlay.shoot = document.createElement("small");
  this.overlay.shoot.innerHTML = "FIRE = CLICK or SPACE";

  this.overlay.warp = document.createElement("small");
  this.overlay.warp.innerHTML = "WARP = SHIFT";

  this.overlay.start = document.createElement("small");
  this.overlay.start.innerHTML = "CLICK to BEGIN";


  this.overlay.instructions.appendChild(this.overlay.move);
  this.overlay.instructions.appendChild(this.overlay.look);
  this.overlay.instructions.appendChild(this.overlay.shoot);
  this.overlay.instructions.appendChild(this.overlay.warp);
  this.overlay.instructions.appendChild(this.overlay.start);
  this.overlay.container.appendChild(this.overlay.title);
  this.overlay.container.appendChild(this.overlay.instructions);
  GFX.overlayElement.appendChild(this.overlay.container);
};

Title.prototype.end = function() {
  GFX.overlayElement.innerHTML = "";
};

module.exports = Title;
