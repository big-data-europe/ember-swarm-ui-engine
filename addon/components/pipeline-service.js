import Ember from 'ember';

export default Ember.Component.extend({
  statusUpdateService: Ember.inject.service('status-update'),
  showLogs: false,
  disableServiceActionButtons: false,

  // Disable scaling works for controlling scaling and restarting
  disableScaling: Ember.observer('service.status', function() {
    this.get('service.status').then((serviceStatus) => {
      if (serviceStatus === null) {
        return this.set('disableServiceActionButtons', true);
      }
      else {
        if (serviceStatus.get('title') !== 'started' && serviceStatus.get('title') !== 'up') {
          return this.set('disableServiceActionButtons', true);
        }
      }
    });
  }).on('init'),

  // Updates the status of the pipeline service.
  updateServiceStatus: function(status) {
    const service = this.get('service');
    return this.get('statusUpdateService').updateStatus(service, status);
  },

  actions: {
    pipelineServiceUp() {
      return this.updateServiceStatus('up');
    },
    pipelineServiceStart() {
      return this.updateServiceStatus('started');
    },
    pipelineServiceStop() {
      return this.updateServiceStatus('stopped');
    },
    pipelineServiceRestart() {
      if (!this.get('disableServiceActionButtons')) {
        let service = this.get('service');
        return service.restart();
      }
    },
    decreaseServiceScaling: function() {
      if (!this.get('disableServiceActionButtons')) {
        let service = this.get('service');
        let scaling = service.get('scaling');
        if (scaling > 0) {
          service.set('scaling', scaling - 1);
          service.save();
        }
      }
    },
    increaseServiceScaling: function() {
      if (!this.get('disableServiceActionButtons')) {
        let service = this.get('service');
        let scaling = service.get('scaling');
        service.set('scaling', scaling + 1);
        service.save();
      }
    },
    toggleLogs: function() {
      if (!this.get('disableServiceActionButtons')) {
        let service = this.get('service');
        service.toggleProperty("showLogs");
        if (service.showLogs) {
          service.refreshLogs();
        }
      }
    },
    refreshLogs: function() {
      var service = this.get('service');
      return service.refreshLogs();
    }
  }
});
