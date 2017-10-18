import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service('store'),

  pollPipeline(timeout=8) {
    return this.pollModel('pipeline-instance', timeout);
  },

  pollService(timeout=6) {
    return this.pollModel('service', timeout);
  },

  // Poll a given model type from the DB
  // and update its status every given timeout
  pollModel(type, timeout) {
    let internalPoll = (model) => {
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
                return internalPoll(model);
              });
            }
            else {
              return internalPoll(model);
            }
        });
      }, timeout);
    };
    return internalPoll;
  }
});
