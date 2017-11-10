import Ember from 'ember';

export function roundTwoDecimals(params/*, hash*/) {
  const [ number ] = params;
  return Number(Math.round(number+'e'+2)+'e-'+2);
}

export default Ember.Helper.helper(roundTwoDecimals);
