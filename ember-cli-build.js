const {
  GlimmerApp
} = require('@glimmer/application-pipeline');

const build = require('@glimmer/build');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const BroccoliDebug = require('broccoli-debug');
const FileCreator = require('broccoli-file-creator');
const fs = require('fs');

module.exports = function (defaults) {
  let debugTree = BroccoliDebug.buildDebugCallback(`glimmer-test-helpers`);

  let external = [
    '@glimmer/component',
  ];

  let libTree = build({
    buildType: 'production',
    external,
    tsconfigPath: 'glimmer-build-tsconfig.json'
  });

  let nodeModules = new MergeTrees([
    'node_modules',
    new Funnel(libTree, { destDir: '@glimmer/test-helpers/dist' }),
    new FileCreator('@glimmer/test-helpers/package.json', fs.readFileSync('package.json', 'utf-8')),
  ]);

  nodeModules = debugTree(nodeModules, 'dummy-app-node-modules');

  let app = new GlimmerApp(defaults, {
    trees: {
      src: 'tests/dummy/src',
      public: 'tests/dummy/public',
      styles: 'tests/dummy/src/ui/styles',
      nodeModules
    }
  });

  let testTree = new Funnel('tests', {
    exclude: ['dummy']
  });

  let appTree = debugTree(app.toTree(), 'appTree');

  appTree = new MergeTrees([appTree, testTree], {
    overwrite: true
  }); // TODO: @rondale-sc - fix me

  appTree = new Funnel(appTree, {
    destDir: 'tests'
  });

  return new MergeTrees([appTree, libTree]);
};