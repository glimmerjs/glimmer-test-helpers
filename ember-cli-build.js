const build = require('@glimmer/build');
const packageDist = require('@glimmer/build/lib/package-dist');

module.exports = function() {
  let external = [
    '@glimmer/component',
  ];
  let vendorTrees = external.map(packageDist);

  return build({
    vendorTrees,
    external
  });
};
