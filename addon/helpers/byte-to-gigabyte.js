import Ember from 'ember';

export function byteToGigabyte(params/*, hash*/) {
  const [ bytes ] = params;
  return bytes / 1073741824.0;
}

export default Ember.Helper.helper(byteToGigabyte);
