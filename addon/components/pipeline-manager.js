import Ember from 'ember';

export default Ember.Component.extend({
  infoText: `
    <strong>Pipelines</strong> & <strong>Services</strong> try to abstract the same behaviour as when working with the docker-compose commandline. A <em>Pipeline</em>
    ideally represents a docker-compose project, and each <em>Service</em> represents a set of containers executed within. Both Pipelines & Services have <em>statuses</em>.
    Statuses define the current point in the lifecycle of both. Some of those statuses are shared accross both concepts. When clicking on UP in a Pipeline, that will
    start both the pipeline & the services inside it. The same happens for STOP, or DOWN buttons. Services(containers) can also be started separately, without starting
    the whole Pipeline.

    <br><br>

    Pipeline:
      <ul style="padding-left: 15px;">
        <li><strong>starting:</strong> the pipeline is being started, this state can be reached either from a newly created pipeline or an already created one.</li>
        <li><strong>started:</strong> the pipeline has finished starting. This state is reached from an already created pipeline.</li>
        <li><strong>up:</strong> the same as started, the pipeline has finished starting. This state is reached when creating a new pipeline, or clicking UP from a stopped one.</li>
        <li><strong>stopping:</strong> the pipeline has been commanded to stop, either by clicking on <strong>STOP</strong> or <strong>DOWN</strong> buttons.</li>
        <li><strong>stopped:</strong> the pipeline is stopped. Volumes and containers are preserved.</li>
        <li><strong>down:</strong> the pipeline is stopped, containers are destroyed and all volumes are removed.</li>
      </ul>

    <br>

    Service:
      <ul style="padding-left: 15px;">
        <li><strong>starting:</strong> the service is being started. This state can be reached either from a newly created container or an already existing one.</li>
        <li><strong>started:</strong> the service has finished starting. This state is reached from an already created container.</li>
        <li><strong>up:</strong> the same as started, the service has finished starting. This state is reached when creating a new container, or clicking UP from a stopped one.</li>
        <li><strong>stopping:</strong> the service has been commanded to stop.</li>
        <li><strong>stopped:</strong> the service is stopped. Volumes and containers are preserved.</li>
        <li><strong>scaling:</strong> the service has received a scaling request, either to increase or decrease the number of containers running in the docker swarm.</li>
      </ul>
  `,
  showDialog: false,
  statusUpdateService: Ember.inject.service('status-update'),
  cpuStatsService: Ember.inject.service('cpu-stats'),
  cpuStatsArray: Ember.computed.oneWay('cpuStatsService.cpuStatsArray'),
  pollService: Ember.inject.service('poll-service'),
  isAdvancedMode: false,
  isActiveObserver: Ember.observer('isActive', function(){
    const isActive = this.get('isActive');
    if (isActive) {
      const pipeline = this.get('pipeline');
      const randomTimeout = Math.floor(Math.random() * 7000) + 6000;
      return this.get('pollService').pollPipeline(pipeline, randomTimeout);
    }
  }).on('init'),

  servicesObserver: Ember.observer('isActive', 'pipeline.services', 'pipeline.services.[]', function() {
    const isActive = this.get('isActive');
    if (isActive) {
      this.get('pipeline.services').then((services) => {
        if (services.length === 0) {
          Ember.run.later(this, function() {
            const model = this.get('pipeline').hasMany('services');
            model.reload();
          }, 1000);
        }
      });
    }
  }).on('init'),

  // Updates the status of the pipeline.
  updateStatus: function(status) {
    const pipeline = this.get('pipeline');
    return this.get('statusUpdateService').updateStatus(pipeline, status);
  },

  actions: {
    handleDockerStats(serviceName, serviceStatsFlag) {
      const cpuStatsService = this.get('cpuStatsService');
      const pipelineId = this.get('pipeline.id');
      return serviceStatsFlag ? cpuStatsService.addService(pipelineId, serviceName) : cpuStatsService.removeService(pipelineId, serviceName);
    },
    showInfoDialog: function() {
      this.set('showInfoDialog', true);
    },
    closeInfoDialog: function() {
      this.set('showInfoDialog', false);
    },
    swarmUp: function() {
      return this.updateStatus('up');
    },
    swarmStart: function() {
      return this.updateStatus('started');
    },
    swarmStop: function() {
      return this.updateStatus('stopped');
    },
    swarmDown: function() {
      return this.updateStatus('down');
    },
    swarmRestart: function() {
      return this.get('pipeline.status').then((stat) => {
        if (stat.get('title') === 'up' || stat.get('title') === 'started' || stat.get('title') === 'starting') {
          this.get('pipeline').restart();
        }
      });
    },
    updatePipeline: function() {
      return this.get('pipeline').update();
    },
    confirmDeletion: function() {
      return this.set("showDialog", true);
    },
    closeDialog: function() {
      return this.set("showDialog", false);
    },
    delete: function() {
      this.set("showDialog", false);
      this.get('pipeline').deleteRecord();
      return this.get('pipeline').save();
    }
  }
});
