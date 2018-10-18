import hbs from '@glimmer/inline-precompile';
import { setupRenderingTest, render } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: Dummy', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders from imported render', async function(assert) {
    await render(hbs`<Dummy />`);
    assert.equal(this.containerElement.textContent, 'Welcome to Glimmer!\n');
  });

  module('stubbing console', function(hooks){
    let oldWarn: any;

    hooks.beforeEach(function (assert) {
      oldWarn = window.console.warn;
      window.console.warn = function (string: string) {
        assert.equal(
          'Using `this.render` in the testing harness is deprecated, please ' +
          'migrate to `import { render } from "@glimmer/test-helpers";` ' +
          'instead.',
          string,
          'warning regarding new render import was logged'
        )
      }
    })

    hooks.afterEach(function(){
      window.console.warn = oldWarn;
    })
    test('it warns when render is called from off of testContext', async function(assert) {
      await this.render(hbs`<Dummy />`);

    });
  });
});
