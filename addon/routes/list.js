import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service('store'),
  model: function() {
    return Ember.RSVP.hash({
      repositories: this.get('store').findAll('repository'),
      stacks: this.get('store').findAll('stack')
    });
  }
});
