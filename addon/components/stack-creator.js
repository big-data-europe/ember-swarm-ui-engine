import Ember from 'ember';
import Validations from 'ember-validations';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service('store'),
  stackIcon: Ember.Object.create(),
  stackTitle: null,
  stackDockerFile: null,

  validations: {
    'stackTitle': {
      presence: true
    },
    'stackDockerFile': {
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
  inputRequiredDockerFileCssClasses: "",

  actions: {
    create: function() {
      //we need to do it like this
      // if i would call it in the if statement, only one would be red at the end
      let isTitleEmpty = this.isInputEmpty('errors.stackTitle', 'inputRequiredTitleCssClasses');
      let isDockerFileEmpty = this.isInputEmpty('errors.stackDockerFile', 'inputRequiredDockerFileCssClasses');
      if (isTitleEmpty || isDockerFileEmpty) {
        return;
      }

      let stack = this.get('store').createRecord('stack', {
        dockerFile: this.get('stackDockerFile'),
        title: this.get('stackTitle'),
        icon: this.get('stackIcon.icon'),
      });
      stack.save().then(() => {
        this.set('stackDockerFile', null);
        this.set('stackTitle', '');
        return this.set('stackIcon', Ember.Object.create());
      });
    },
    clear: function() {
      this.set('stackDockerFile', null);
      this.set('stackTitle', "");
      this.set('inputRequiredTitleCssClasses', "");
      this.set('inputRequiredDockerFileCssClasses', "");
      this.set('stackIcon.icon', '');
      return false;
    },
  }
});
