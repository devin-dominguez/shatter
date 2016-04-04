var Util = require('./util');
var App = require('./app');

window.addEventListener("load", function(ev) {
  window.app = new App();
  app.update();
});
