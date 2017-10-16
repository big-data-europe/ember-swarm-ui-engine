import Ember from 'ember';
import moment from 'moment';


export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  statusUpdateService: Ember.inject.service('status-update'),

  editing: false,

  createFromLocation: true,

  launchPipeline: function(item) {
    var dateNow = moment().format(' YYYY.MM.DD HH:mm:ss');
    var pipeline = {
      title: item.get('title') + dateNow,
      icon: item.get('icon'),
      status: status,
      stack: item
    };

    this.get('statusUpdateService').getRequestedStatus('down').then((status) => {
      pipeline.status = status;
      let newPipeline = this.get('store').createRecord('pipeline-instance', pipeline);
      newPipeline.save().then((newPip) => {
        this.sendAction('goToPipelines', newPip.get('id'));
      });
    });

  },

  actions: {
    launchPipeline: function(item) {
      this.launchPipeline(item);
      return false;
    }

  }
});
