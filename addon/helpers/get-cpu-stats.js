import Ember from 'ember';

export function getCpuStats(params) {
  let [ services, pipeline, service ] = params;
  if (services) {
    const element = services.find(el => {
      const pipelineId = pipeline.get('id');
      const serviceTitle = service.get('name');
      return el.name === `/${pipelineId.toLowerCase()}_${serviceTitle}_1`;
    });
    return element;
  }
  else return null;
}

export default Ember.Helper.helper(getCpuStats);
