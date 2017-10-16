import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['relatedStack'],
  relatedStack: "",

  actions: {
    goToPipelines: function() {
      this.transitionToRoute('pipelines');
      return false;
    }
  }
});
