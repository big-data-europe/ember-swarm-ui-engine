import Ember from 'ember';

export function byteToMegabyte(params/*, hash*/) {
  const [ bytes ] = params;
  return bytes / 1048576.0;
}

export default Ember.Helper.helper(byteToMegabyte);
