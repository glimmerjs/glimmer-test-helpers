import hbs from '@glimmer/inline-precompile';
import { setupRenderingTest, render } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: Dummy', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders from imported render', async function(assert) {
    await render(hbs`<Dummy />`);
    assert.equal(this.containerElement.textContent, 'Welcome to Glimmer!\n');
  });
});
