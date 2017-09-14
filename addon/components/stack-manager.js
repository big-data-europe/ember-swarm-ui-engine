import Ember from 'ember';
import Validations from 'ember-validations';


export default Ember.Component.extend(Validations, {
  showDialog: false,
  title: Ember.computed.alias('model.title'),
  newDockerFile: Ember.computed.oneWay('model.dockerFile'),

  validations: {
    'model.title': {
      presence: true,
      length: { minimum: 1 }
    },
    'model.dockerFile': {
      presence: true
    }
  },
  inputRequiredTitleCssClasses: "",

  isInputEmpty: function(inputFieldErrors, cssClasses) {
    if (this.get(inputFieldErrors) && (this.get(inputFieldErrors).length > 0)) {
      this.set(cssClasses, 'input-required');
      return true;
    }
    this.set(cssClasses, '');
    return false;
  },

  actions: {
    save: function() {
      //we need to do it like this
      // if i would call it in the if statement, only one would be red at the end
      let isTitleEmpty = this.isInputEmpty('errors.model.title', 'inputRequiredTitleCssClasses');
      let isDockerFileEmpty = this.isInputEmpty('errors.newDockerFile', 'inputRequiredDockerFileCssClasses');
      if (isTitleEmpty || isDockerFileEmpty) {
        return;
      }

      this.set('model.dockerFile', this.get('newDockerFile'));
      this.get('model').save().then((function(_this) {
        return function() {
          return _this.sendAction("edit");
        };
      })(this));
    },
    cancel: function() {
      this.get('model').rollbackAttributes();
      return this.sendAction("edit");
    },
    confirmDeletion: function() {
      this.set("showDialog", true);
    },
    closeDialog: function() {
      this.set("showDialog", false);
    },
    delete: function() {
      this.set("showDialog", false);
      this.get('model').deleteRecord();
      this.get('model').save();
    }
  }
});
