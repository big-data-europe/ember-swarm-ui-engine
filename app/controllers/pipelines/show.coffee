`import Ember from 'ember'`

PipelinesShowController = Ember.Controller.extend
  pipelineOp: (operation, callback) ->
    @get('model').pushAction =>
      new Ember.RSVP.Promise (success) =>
        Ember.$.ajax( "/swarm/pipelines/#{@get('model.id')}/#{operation}"
          method: "POST"
        ).then ->
          success()
          callback?()
  actions:
    swarmUp: ->
      @pipelineOp "up", => alert("#{@get('model.title')} started up")
    swarmStop: ->
      @pipelineOp "stop", => alert("#{@get('model.title')} stopped")
    swarmDown: ->
      @pipelineOp "down", => alert("Brought down #{@get('model.title')}")
    serviceScale: (service) ->
      service.performScaling().then =>
        alert("scaled #{service.get('name')}")


`export default PipelinesShowController`
