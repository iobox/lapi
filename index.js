// AUTO GENERATED ==>
var $exports = {
 "Collection": "collection.js",
 "Event": {
  "Event": "event/event.js",
  "Listener": "event/listener.js",
  "EventManager": "event/manager.js"
 },
 "Exception": {
  "InvalidArgumentException": "exception/invalid-argument.js"
 },
 "Foundation": {
  "App": "foundation/app.js",
  "Bag": "foundation/bag.js",
  "Container": "foundation/container.js",
  "Exception": "foundation/exception.js",
  "Extension": {
   "ContainerExtension": "foundation/extension/container.js",
   "ExtensionInterface": "foundation/extension/interface.js",
   "ExtensionManager": "foundation/extension/manager.js"
  },
  "Kernel": "foundation/kernel.js"
 },
 "Http": {
  "Body": "http/body.js",
  "Exception": {
   "HttpException": "http/exception/http.js"
  },
  "Header": "http/header.js",
  "Message": "http/message.js",
  "Query": {
   "Extension": {
    "CommonExtension": "http/query/extension/common.js",
    "ExtensionInterface": "http/query/extension/interface.js"
   },
   "Validator": "http/query/validator.js"
  },
  "Request": "http/request.js",
  "Response": "http/response.js",
  "Routing": {
   "Route": "http/routing/route.js",
   "Router": "http/routing/router.js"
  }
 },
 "Utils": {
  "Str": "utils/str.js"
 }
};
// <== AUTO GENERATED

const distDir = 'dist';
function include(file, name) {
  const pkg = require('./' + distDir + '/' + file);
  return name === undefined ? pkg.default : pkg[name];
}

var exports = function ($exports) {
  Object.keys($exports).forEach(function (name) {
    if (typeof $exports[name] === 'object') {
      exports($exports[name])
    } else {
      $exports[name] = include($exports[name])
    }
  });
};
exports($exports);

module.exports = $exports;