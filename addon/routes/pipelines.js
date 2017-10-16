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
  }
});
