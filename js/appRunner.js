var Util = require('./util');
var App = require('./app');

window.addEventListener("load", function(ev) {
  var app = new App();
  app.render();
});
