import Ember from 'ember';

export default Ember.Service.extend({
    observedServices: Ember.A(),
    pollStatsSemaphore: true,
    observedServicesObserver: Ember.observer('observedServices.[]', function() {
        let observedServices = this.get('observedServices');
        let timer = this.pollStats(observedServices);

        if (observedServices.length === 0)
          this.enableSemaphore();
          Ember.run.cancel(timer);
    }),
    enableSemaphore() {
        return this.set('pollStatsSemaphore', true);
    },
    disableSemaphore() {
        return this.set('pollStatsSemaphore', false);
    },
    addService(pipelineId, serviceName) {
        return this.get('observedServices').pushObject({ pipeline: pipelineId, service: serviceName});
    },
    removeService(pipelineId, serviceName) {
        const observedServices = this.get('observedServices');
        const objToRemove = observedServices.find(el =>
            el.pipeline === pipelineId && el.service === serviceName);
        return this.get('observedServices').removeObject(objToRemove);
    },
    pollStats(observedServices, timeout = 500) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            return Ember.run.later(this, () => {
                if (this.get('pollStatsSemaphore')) {
                    this.disableSemaphore();
                    this.getDockerStats(observedServices, timeout)
                        .then(stats => {
                            this.enableSemaphore();
                            resolve(stats);
                        })
                        .catch(err => {
                            this.enableSemaphore();
                            reject(err)
                        });
                }
                else return this.pollStats(observedServices, timeout+500);
            }, timeout);
        });
    },
    getDockerStats(observedServices = [], timeout = 500) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        const pipelines = observedServices.map(serv => serv.pipeline);
        const services = observedServices.map(serv => serv.service);

        if (observedServices.length > 0) {
          Ember.$.ajax({
            type: 'GET',
            url: `drcstats/stats?pipelines=${pipelines.join(',')}&services=${services.join(',')}`,
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
