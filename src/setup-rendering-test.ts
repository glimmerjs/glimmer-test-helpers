import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import { getApp } from './app';

type SerializedTemplateWithLazyBlock = any;

export default function setupRenderingTest(hooks: NestedHooks): void {
  hooks.beforeEach(function beforeEach() {
    this.app = new (getApp() as any);
    this.render = render.bind(this);
    this.settled = settled.bind(this);
  });

  hooks.afterEach(function afterEach() {
    this.containerElement.remove();
  });
}

function render(precompiledTemplate: SerializedTemplateWithLazyBlock): Promise<void> {
  let app = this.app;
  let containerElement = document.createElement('div');

  setPropertyDidChange(() => {
    app.scheduleRerender();
  });

  app.registerInitializer({
    initialize(registry: any) {
      // TODO: temporary hack until we consolidate registries
      registry._resolver.registry._entries[`template:/${app.rootName}/components/test-container`] = precompiledTemplate;
      registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
    }
  });

  app.renderComponent('test-container', containerElement);
  return Promise.resolve(app.boot())
    .then(() => {
      this.containerElement = containerElement;
      this.app = app;
    });
}

async function settled(): Promise<void> {
  return new Promise<void>(resolve => {
    let watcher = setInterval(() => {
      if (this.app['_rendering']) return;
      clearInterval(watcher);
      resolve();
    }, 10);
  });
};
