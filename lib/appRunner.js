const Util = require('./util');
const App = require('./app');

window.addEventListener("load", function(ev) {
  window.app = new App();
  app.update();
});
