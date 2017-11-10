
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('round-two-decimals', 'helper:round-two-decimals', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{round-two-decimals inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

