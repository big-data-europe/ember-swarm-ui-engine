import Ember from 'ember';
import Validations from 'ember-validations';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service('store'),
  repositoryIcon: Ember.Object.create(),
  repositoryTitle: null,
  repositoryLocation: null,

  validations: {
    'repositoryTitle': {
      presence: true
    },
    'repositoryLocation': {
      presence: true
    }
  },
  isInputEmpty: function(inputFieldErrors, cssClasses) {
    if (this.get(inputFieldErrors).length > 0) {
      this.set(cssClasses, 'input-required');
      return true;
    }
    this.set(cssClasses, '');
    return false;
  },

  inputRequiredTitleCssClasses: "",
  inputRequiredLocationCssClasses: "",

  actions: {
    create: function() {
      //we need to do it like this
      // if i would call it in the if statement, only one would be red at the end
      let isTitleEmpty = this.isInputEmpty('errors.repositoryTitle', 'inputRequiredTitleCssClasses');
      let isLocationEmpty = this.isInputEmpty('errors.repositoryLocation', 'inputRequiredLocationCssClasses');
      if (isTitleEmpty || isLocationEmpty) {
        return;
      }

      let repository = this.get('store').createRecord('repository', {
        location: this.get('repositoryLocation'),
        title: this.get('repositoryTitle'),
        icon: this.get('repositoryIcon.icon'),
      });
      repository.save().then(() => {
        this.set('repositoryLocation', '');
        this.set('repositoryTitle', '');
        return this.set('repositoryIcon', Ember.Object.create());
      });
    },
    clear: function() {
      this.set('repositoryLocation', "");
      this.set('repositoryTitle', "");
      this.set('inputRequiredTitleCssClasses', "");
      this.set('inputRequiredLocationCssClasses', "");
      this.set('repositoryIcon.icon', "");
      return false;
    },
  }
});
