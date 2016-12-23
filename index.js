const distDir  = 'dist';
function include(file, name) {
  const package = require('./' + distDir + '/' + file);
  return typeof name === 'undefined' ? package.default : package[name];
}

var $exports = {
  Bag: 'bag',
  Str: 'str',

  HttpRequest: 'http/request',
  HttpResponse: 'http/response'
};

Object.keys($exports).forEach(function(name) {
  $exports[name] = include($exports[name])
});
module.exports = $exports;