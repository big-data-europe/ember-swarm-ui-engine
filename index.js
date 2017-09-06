/*jshint node:true*/
const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
  name: 'ember-swarm-ui-engine',
  isDevelopingAddon: function() {
    return true;
  },
  lazyLoading: true,
  included(app) {
    this.bowerDirectory = app.bowerDirectory;
    this._super.included.apply(this, app);
    app.import(app.bowerDirectory + '/materialize/dist/js/materialize.js');
  }
});