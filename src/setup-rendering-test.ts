
import { setContext } from './setup-context';
import { getApp } from "./app";

export default function setupRenderingTest(hooks: NestedHooks): void {
  hooks.beforeEach(function beforeEach() {
    setContext(this);
    this.app = new (getApp() as any)();
    this.settled = settled.bind(this);
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
