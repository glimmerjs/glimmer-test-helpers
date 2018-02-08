const build = require('@glimmer/build');
const packageDist = require('@glimmer/build/lib/package-dist');

module.exports = function() {
  let external = [
    '@glimmer/component',
  ];

  return build({
    external
  });
};
