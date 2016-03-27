var THREE = require('three');

var entry = document.createElement("div");
var overlay = document.createElement("div");
overlay.style.position = "absolute";
overlay.style.width = "100%";

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 0.1, 1024);

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1024
    );

var renderer= new THREE.WebGLRenderer({
  precision: "lowp",
  antialias: false
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";


window.addEventListener("resize", function(e) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

window.addEventListener("load", function(e) {

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
