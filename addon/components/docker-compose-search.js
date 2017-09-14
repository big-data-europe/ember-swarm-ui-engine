import Ember from 'ember';
import {
  task,
  timeout
} from 'ember-concurrency';
import env from '../config/environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['docker-compose-search'],
  dockerComposeList: task(function*(term) {
    // if (Ember.isBlank(term)) {
    //   return this.get('model');
    // }

    // Pause here for DEBOUNCE_MS milliseconds. Because this
    // task is `restartable`, if the user starts typing again,
    // the current search will be canceled at this point and
    // start over from the beginning. This is the
    // ember-concurrency way of debouncing a task.
    yield timeout(env.searchDebounceMiliseconds);

    return yield this.filterComposeFiles(term);
  }).on('init').restartable(),

  filterComposeFiles: function(searchValue){
    var params = {
      sort: 'title'
    };
    if (searchValue !== null) {
      params.filter = {
        title: searchValue
      };
    } else {
      params.page = {
        size: env.defaultNumberOfContainers,
        number: 0
      };
    }

    return this.get('store').query('docker-compose', params);
  }
});
