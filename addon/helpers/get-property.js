import Ember from 'ember';

export function getProperty(params) {
  const [ obj, prop ] = params;
  return typeof obj != "undefined" && obj[prop] !== null ? obj[prop] : null;
}

export default Ember.Helper.helper(getProperty);
