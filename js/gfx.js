var THREE = require('three');

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 0.1, 450);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 450);
var renderer= new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", function(e) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

window.addEventListener("load", function(e) {
  document.body.appendChild(renderer.domElement);
});

function render() {
  renderer.render(scene, camera);
}

module.exports = {
  scene: scene,
  camera: camera,
  rederer: renderer,
  element: renderer.domElement,
  render: render
};
