import Ember from 'ember';


export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  statusUpdateService: Ember.inject.service('status-update'),

  editing: false,

  isRepository: true,

  launchPipeline: function(item) {
    var pipeline = {
      title: item.get('title'),
      icon: item.get('icon'),
      status: status
    };

    if (item.isRepository) {
      pipeline.repository = item;
    } else if (item.isStack) {
      pipeline.stack = item;
    }

    this.get('statusUpdateService').getRequestedStatus('down').then((status) => {
      pipeline.status = status;
      let newPipeline = this.get('store').createRecord('pipeline-instance', pipeline);
      newPipeline.save();
    });
  },

  actions: {
    launchPipeline: function(item) {
      this.launchPipeline(item);
      return false;
    }

  }
});
