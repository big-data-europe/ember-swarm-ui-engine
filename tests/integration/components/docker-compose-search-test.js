import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('docker-compose-search', 'Integration | Component | docker compose search', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{docker-compose-search}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#docker-compose-search}}
      template block text
    {{/docker-compose-search}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
