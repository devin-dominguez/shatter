const THREE = require('three');

let entry = document.createElement("div");
let overlay = document.createElement("div");
overlay.style.position = "absolute";
overlay.style.width = "100%";

let scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x8888cc, 0.1, 1024);

let camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1024
    );

let renderer= new THREE.WebGLRenderer({
  precision: "lowp",
  antiAlias: false
});

renderer.setPixelRatio(1);

renderer.domElement.requestPointerLock =
  renderer.domElement.requestPointerLock ||
  renderer.domElement.mozRequestPointerLock;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";

window.addEventListener("resize", function(e) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

window.addEventListener("load", function(e) {
  setBgColor(0x8888cc);

  entry.appendChild(renderer.domElement);
  entry.appendChild(overlay);
  document.body.appendChild(entry);
});

function render() {
  renderer.render(scene, camera);
}

function setBgColor(color) {
  scene.fog = new THREE.Fog(color, 0.1, 640);
  renderer.setClearColor(color, 1.0);
}

module.exports = {
  scene: scene,
  camera: camera,
  rederer: renderer,
  element: renderer.domElement,
  render: render,
  overlayElement: overlay,
  setBgColor: setBgColor
};
