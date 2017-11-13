import Ember from 'ember';

export function getHead(params) {
  const [ arr ] = params;
  return arr[0];
}

export default Ember.Helper.helper(getHead);
