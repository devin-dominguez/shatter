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

  this.overlay.move = document.createElement("span");
  this.overlay.move.innerHTML = "&nbsp;WASD -> MOVE";

  this.overlay.look = document.createElement("span");
  this.overlay.look.innerHTML = "MOUSE -> LOOK";

  this.overlay.shoot = document.createElement("span");
  this.overlay.shoot.innerHTML = "CLICK -> SHOOT";

  this.overlay.warp = document.createElement("span");
  this.overlay.warp.innerHTML = "SPACE -> WARP TIME AND SPACE";

  this.overlay.start = document.createElement("span");
  this.overlay.start.innerHTML = "PRESS ENTER TO BEGIN";


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
