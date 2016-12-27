var $exports = {
  Bag: 'bag',
  Str: 'str',

  App: 'foundation/app',
  Kernel: 'foundation/kernel',
  Container: 'foundation/container',
  Extension: 'foundation/extension',
  Controller: 'foundation/controller',

  Route: 'http/routing/route',
  Router: 'http/routing/router',
  Header: 'http/header',
  Request: 'http/request',
  Response: 'http/response'
};

const distDir  = 'dist';
function include(file, name) {
  const package = require('./' + distDir + '/' + file);
  return typeof name === 'undefined' ? package.default : package[name];
}

Object.keys($exports).forEach(function(name) {
  $exports[name] = include($exports[name])
});
module.exports = $exports;