import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    edit: function() {
      this.toggleProperty('editing');
      return false;
    },
    launchPipeline: function(item) {
      this.sendAction('launchPipeline', item);
    }
  }
});
