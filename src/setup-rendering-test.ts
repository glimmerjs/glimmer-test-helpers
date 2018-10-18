import { render } from './render';
import { setContext } from './setup-context';
import { getApp } from "./app";

type SerializedTemplateWithLazyBlock = any;

export default function setupRenderingTest(hooks: NestedHooks): void {
  hooks.beforeEach(function beforeEach() {
    setContext(this);
    this.app = new (getApp() as any)();
    this.settled = settled.bind(this);

    this.render = (precompiledTemplate: SerializedTemplateWithLazyBlock) => {
      console.warn('Using `this.render` in the testing harness is deprecated, please migrate to `import { render } from "@glimmer/test-helpers";` instead.');
      return render(precompiledTemplate);
     };
  });

  hooks.afterEach(function afterEach() {
    this.containerElement.remove();
  });
}

async function settled(): Promise<void> {
  return new Promise<void>(resolve => {
    let watcher = setInterval(() => {
      if (this.app["_rendering"]) return;
      clearInterval(watcher);
      resolve();
    }, 10);
  });
}
