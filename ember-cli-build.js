const { GlimmerApp } = require('@glimmer/application-pipeline');

const build = require('@glimmer/build');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let external = [
    '@glimmer/component',
  ];

  let libTree = build({ buildType: 'production', external, tsconfigPath: 'glimmer-build-tsconfig.json'});

  let app = new GlimmerApp(defaults, {
    trees: {
      src: 'tests/dummy/src',
      public: 'tests/dummy/public',
      styles: 'tests/dummy/src/ui/styles'
    }
  });

  let testTree = new Funnel('tests', {
    exclude: ['dummy']
  });

  let appTree = new MergeTrees([app.toTree(), testTree], { overwrite: true }); // TODO: @rondale-sc - fix me

  appTree = new Funnel(appTree, {
    destDir: 'tests'
  });


  return new MergeTrees([appTree, libTree]);
};