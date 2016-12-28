// AUTO GENERATED ==>
var $exports = {};
// <== AUTO GENERATED

const distDir  = 'dist';
function include(file, name) {
  const pkg = require('./' + distDir + '/' + file);
  return name === undefined ? pkg.default : pkg[name];
}

Object.keys($exports).forEach(function(name) {
  $exports[name] = include($exports[name])
});
module.exports = $exports;