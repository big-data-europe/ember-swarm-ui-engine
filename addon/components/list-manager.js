import Ember from 'ember';
import moment from 'moment';


export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  statusUpdateService: Ember.inject.service('status-update'),

  editing: false,

  createFromLocation: true,

  pollForServices(pipeline, count = 0) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const internalPoll = (pipeline, count) => {
        if (count === 10) {
          return reject("Pipeline services could not be fetched");
        }
        const services = pipeline.hasMany('services');
        return services.reload()
          .then(services => {
            if (services.length === 0) {
              return Ember.run.later(this, function () {
                return internalPoll(pipeline, count+1);
              }, 1000);
            }
            else return resolve(true);
          })
          .catch(err => reject(err));
      };

      return internalPoll(pipeline, count);
    });
  },

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
      this.set('loadingServices', true);
      newPipeline.save().then((newPip) => {
        this.pollForServices(newPip)
          .then(status => {
            this.set('loadingServices', false);
            return this.sendAction('goToPipelines', newPip.get('id'));
          })
          .catch(err => {
            this.set('loadingServices', false);
            throw new Error(err);
          });
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
