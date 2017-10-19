import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  pollSemaphore: true,

  pollPipeline(model, timeout=8) {
    return this.pollModel('pipeline-instance', model, timeout);
  },

  pollService(model, timeout=6) {
    return this.pollModel('service', model, timeout);
  },

  activatePoll() {
    return this.set('pollSemaphore', true);
  },

  deActivatePoll() {
    return this.set('pollSemaphore', false);
  },

  // Poll a given model type from the DB
  // and update its status every given timeout
  pollModel(type, model, timeout) {
    let timer = Ember.run.later(this, function() {
      Ember.run.later(this, function() {
        const options = { reload: true, include: 'status' };
        let modelDiff = Ember.RSVP.hash({
          currentModel: model,
          freshModel: this.get('store').findRecord(type, model.get('id'), options)
        });
        modelDiff.then((mDiff) => {
            const curStatus = mDiff.currentModel.get('status');
            const freshStatus = mDiff.freshModel.get('status');
            if (curStatus.get('title') !== freshStatus.get('title')) {
              model.set('status', freshStatus).then(() => {
                return this.pollModel(type, model, timeout);
              });
            }
            else {
              return this.pollModel(type, model, timeout);
            }
        });
      }, timeout);
    }, 800);
    if (!this.get('pollSemaphore')) {
      Ember.run.cancel(timer);
    }
  }
});
