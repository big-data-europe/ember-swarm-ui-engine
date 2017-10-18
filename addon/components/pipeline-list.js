import Ember from 'ember';

export default Ember.Component.extend({
  editable: true,
  lastClicked: null,

  manageButtonText: Ember.computed('editable', function(){
    if(this.get('editable')){
      return "Cancel";
    }
    return "Manage";
  }),
  actions: {
    manage:  function() {
      this.toggleProperty('editable');
    },
    choosePipeline: function(pipelineId) {
      if (this.get('lastClicked') === pipelineId) {
        this.set('lastClicked', null);
        return false;
      }
        this.set('lastClicked', pipelineId);
        return false;
    }
  }
});
