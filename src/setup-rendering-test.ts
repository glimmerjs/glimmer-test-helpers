import Component, {
  ComponentManager,
  setPropertyDidChange,
  RootReference
} from "@glimmer/component";

import { getApp } from "./app";

type SerializedTemplateWithLazyBlock = any;

export default function setupRenderingTest(hooks: NestedHooks): void {
  hooks.beforeEach(function beforeEach() {
    this.app = new (getApp() as any)();
    this.render = render.bind(this);
    this.settled = settled.bind(this);
  });

  hooks.afterEach(function afterEach() {
    this.containerElement.remove();
  });
}

function render(
  precompiledTemplate: SerializedTemplateWithLazyBlock
): Promise<void> {
  precompiledTemplate.meta.managerId = "test-container";

  let testContext = this;
  let app = testContext.app;

  let containerElement = document.createElement("div");

  setPropertyDidChange(() => {
    app.scheduleRerender();
  });

  app.registerInitializer({
    initialize(registry: any) {
      registry._resolver.registry._entries[
        `template:/${app.rootName}/components/test-container`
      ] = precompiledTemplate;

      registry._resolver.registry._entries[
        `component:/${app.rootName}/components/test-container`
      ] = Component;

      class CustomComponentManager extends ComponentManager {
        static create(options: any) {
          return new this(options);
        }

        getSelf() {
          return new RootReference(testContext);
        }
      }

      registry.register(
        `component-manager:/${app.rootName}/component-managers/test-container`,
        CustomComponentManager
      );

      /*
       * Register the main ComponentManager for everything else to use as their
       * default
       */
      registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
    }
  });

  app.renderComponent("test-container", containerElement);
  return Promise.resolve(app.boot()).then(() => {
    testContext.containerElement = containerElement;
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
