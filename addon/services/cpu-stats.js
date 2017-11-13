import Ember from 'ember';

export default Ember.Service.extend({
    observedServices: Ember.A(),
    callQueue: Ember.A(),
    isPolling: false,
    requestTimer: undefined,
    observedServicesObserver: Ember.observer('observedServices.[]', function() {
        const observedServices = this.get('observedServices');
        if (observedServices.length > 0) {
          this.set('isPolling', true);
          this.set('requestTimer', this.loopPoll());
        }
        else {
          Ember.run.cancel(this.get('requestTimer'));
          this.set('isPolling', false);
        }
    }),
    enableSemaphore() {
        return this.set('pollStatsSemaphore', true);
    },
    disableSemaphore() {
        return this.set('pollStatsSemaphore', false);
    },
    addService(pipelineId, serviceName) {
        return this.get('observedServices').pushObject({ pipeline: pipelineId,
                                                         service: serviceName });
    },
    removeService(pipelineId, serviceName) {
      const observedServices = this.get('observedServices');
      const objToRemove = observedServices.find(el =>
        el.pipeline === pipelineId && el.service === serviceName);
      return this.get('observedServices').removeObject(objToRemove);
    },
    loopPoll() {
      const randomTimeout = Math.floor(Math.random() * 5000) + 4000;
      return Ember.run.later(this, function() {
          return this.getDockerStats(this.get('observedServices'))
                  .then(stats => {
                    this.set('cpuStatsArray', stats);
                    if (this.get('isPolling') === true) return this.loopPoll();
                  })
                  .catch(err => this.set('cpuStatsArray', null));
      }, randomTimeout);
    },
    // Fetch docker cpu stats from service.
    getDockerStats(observedServices = []) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        const pipelines = observedServices.map(serv => serv.pipeline);
        const services = observedServices.map(serv => serv.service);

        const pipelinesArgs = pipelines.join(',');
        const servicesArgs = services.join(',');

        if (observedServices.length > 0) {
          Ember.$.ajax({
            type: 'GET',
            url: `drcstats/stats?pipelines=${pipelinesArgs}&services=${servicesArgs}`,
            accept: 'application/json; charset=utf-8',
            dataType: 'json',
            success: (data => resolve(data)),
            error: (error => reject(error))
          });
        }
        else return resolve(null);
      });
    }
});
