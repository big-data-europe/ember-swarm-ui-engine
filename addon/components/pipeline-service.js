import Ember from 'ember';

export default Ember.Component.extend({
  statusUpdateService: Ember.inject.service('status-update'),
  showLogs: false,
  getServiceStats: false,
  disableServiceActionButtons: false,
  pollService: Ember.inject.service('poll-service'),
  isActiveObserver: Ember.observer('isActive', function(){
    const isActive = this.get('isActive');
    if (isActive) {
      const service = this.get('service');
      const randomTimeout = Math.floor(Math.random() * 5000) + 4000;
      return this.get('pollService').pollService(service, randomTimeout);
    }
  }).on('init'),

  getServiceStatsObserver: Ember.observer('getServiceStats', function() {
    const getServiceStats = this.get('getServiceStats');
    return this.send('handleDockerStats', getServiceStats);
  }).on('init'),

  // Updates the status of the pipeline service.
  updateServiceStatus: function(status) {
    const service = this.get('service');
    return this.get('statusUpdateService').updateStatus(service, status);
  },

  updateScaling: function() {
    let service = this.get('service');
    if(!service){ return;}
    let scaling = service.get('scaling');
    if(!scaling) {return;}
    console.debug("Updating scaling for service: "+service.get('name'));
    service.set('scalingRequested', scaling);
    return service.save().then(service => {
      service.set('scalingRequested', null);
      return service;
    });
  },

  // Disable scaling works for controlling scaling and restarting
  disableScaleAndRestartObserver: Ember.observer('service.status', 'forcedMode', function() {
    if(this.get('forcedMode')) {
      return this.set('disableServiceActionButtons', false);
    }
    let enableScalingStates = ['started', 'up'];
    this.get('service.status').then((serviceStatus) => {
      if (serviceStatus === null || enableScalingStates.indexOf(serviceStatus.get('title')) === -1) {
        return this.set('disableServiceActionButtons', true);
      }
      else {
        return this.set('disableServiceActionButtons', false);
      }
    });
  }).on('init'),

  // Disable (or not) the up / start / stop buttons depending on the status of the service and whether we are in "forced" mode
  disabledButtonsObserver: Ember.observer('service.status', 'forcedMode', function() {
    const _this = this;
    return this.get('service.status').then(status => {
      if(_this.get('forcedMode')) {
        return _this.set('disabledButtons', {
          up: false,
          start: false,
          stop: false
        });
      }
      if(!status || !status.get('title')) {return {};}
      return _this.set('disabledButtons', {
        "up": ["up", "starting", "started"].contains(status.get('title')),
        "start": ["up", "starting", "started"].contains(status.get('title')),
        "stop": !["up", "starting", "started"].contains(status.get('title'))
      });
    });
  }).on('init'),

  disabledButtons: {},

  actions: {
    handleDockerStats(serviceStatsFlag) {
      return this.sendAction('handleDockerStats', this.get('service.name'), serviceStatsFlag);
    },
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
          Ember.run.debounce(this, "updateScaling", 4000);
        }
      }
    },
    increaseServiceScaling: function() {
      if (!this.get('disableServiceActionButtons')) {
        let service = this.get('service');
        let scaling = service.get('scaling');
        service.set('scaling', scaling + 1);
        Ember.run.debounce(this, "updateScaling", 4000);
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
