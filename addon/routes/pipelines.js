import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    latestPipeline: {
      refreshModel: true
    }
  },
  store: Ember.inject.service('store'),
  model: function() {
    return this.get('store').findAll('pipeline-instance');
  },
  resetController(controller, isExiting, transition) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      controller.set('latestPipeline', '');
    }
  }
});
