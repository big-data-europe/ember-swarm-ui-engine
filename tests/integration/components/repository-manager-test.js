import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('repository-manager', 'Integration | Component | repository manager', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{repository-manager}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#repository-manager}}
      template block text
    {{/repository-manager}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
