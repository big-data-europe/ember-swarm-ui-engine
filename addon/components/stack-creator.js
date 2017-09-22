import Ember from 'ember';
import Validations from 'ember-validations';

export default Ember.Component.extend(Validations, {
  store: Ember.inject.service('store'),
  stackIcon: Ember.Object.create(),
  stackTitle: null,
  stackDockerFile: null,
  stackLocation: null,

  validations: {
    'stackTitle': {
      presence: true
    },
    'stackDockerFile': {
      presence: true
    },
    'stackLocation': {
      presence: true
    }
  },

  isInputEmpty: function (inputFieldErrors, cssClasses) {
    if (this.get(inputFieldErrors).length > 0) {
      this.set(cssClasses, 'input-required');
      return true;
    }
    this.set(cssClasses, '');
    return false;
  },

  inputRequiredTitleCssClasses: "",
  inputRequiredDockerFileCssClasses: "",
  inputRequiredLocationCssClasses: "",

  actions: {
    create: function () {
      //we need to do it like this
      // if i would call it in the if statement, only one would be red at the end
      let isTitleEmpty = this.isInputEmpty('errors.stackTitle', 'inputRequiredTitleCssClasses');
      let isDockerFileEmpty = this.isInputEmpty('errors.stackDockerFile', 'inputRequiredDockerFileCssClasses');
      let isLocationEmpty = this.isInputEmpty('errors.stackLocation', 'inputRequiredLocationCssClasses');


      // depending on the type we check for:
      // with Location: title & location
      //  with docker-file: title & dockerfile
      if (this.get('createFromLocation') === true) {
        if (isTitleEmpty || isLocationEmpty) {
          return;
        }
      }
      else {
        if (isTitleEmpty || isDockerFileEmpty) {
          return;
        }
      }

      let stack = this.get('store').createRecord('stack', {
        title: this.get('stackTitle'),
        icon: this.get('stackIcon.icon'),
      });

      // depending on the type we create a stack with
      // either a dockerfile or a git repo location
      if (this.get('createFromLocation') === true) {
        stack.set('location', this.get('stackLocation'));
      }
      else {
        stack.set('dockerFile', this.get('stackDockerFile'));
      }

      stack.save().then(() => {
        this.set('stackDockerFile', null);
        this.set('stackTitle', '');
        this.set('stackLocation', '');
        this.set('inputRequiredLocationCssClasses', "");
        this.set('inputRequiredTitleCssClasses', "");
        this.set('inputRequiredDockerFileCssClasses', "");
        return this.set('stackIcon', Ember.Object.create());
      });
    },
    clear: function () {
      this.set('stackDockerFile', null);
      this.set('stackTitle', "");
      this.set('stackLocation', "");
      this.set('inputRequiredLocationCssClasses', "");
      this.set('inputRequiredTitleCssClasses', "");
      this.set('inputRequiredDockerFileCssClasses', "");
      this.set('stackIcon.icon', '');
      return false;
    },
  }
});
