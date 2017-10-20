import Ember from 'ember';

export function isPipelineRunning(params) {
  let [title, status] = params;
  return (status === 'up' || status === 'started') ? `${title} - [Running]` : title;
}

export default Ember.Helper.helper(isPipelineRunning);
