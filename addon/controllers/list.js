import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['relatedStack'],
  relatedStack: "",

  actions: {
    goToPipelines: function(pipelineId) {
      this.transitionToRoute('pipelines', { queryParams: { latestPipeline: pipelineId }});
      return false;
    }
  }
});
