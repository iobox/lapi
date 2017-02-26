// AUTO GENERATED ==>
var $exports = {
 "App": "app.js",
 "Collection": "collection.js",
 "di": {
  "ContainerAware": "di/container-aware.js",
  "Container": "di/container.js"
 },
 "event": {
  "EventListener": "event/listener.js",
  "EventManager": "event/manager.js"
 },
 "exception": {
  "InternalErrorException": "exception/internal-error.js",
  "InvalidArgumentException": "exception/invalid-argument.js",
  "NotFoundException": "exception/not-found.js",
  "NotImplementedException": "exception/not-implemented.js"
 },
 "Exception": "exception.js",
 "foundation": {
  "Bag": "foundation/bag.js",
  "extension": {
   "ExtensionManager": "foundation/extension/manager.js"
  },
  "Extension": "foundation/extension.js"
 },
 "http": {
  "Body": "http/body.js",
  "Controller": "http/controller.js",
  "exception": {
   "HttpException": "http/exception/http.js",
   "InvalidArgumentException": "http/exception/invalid-argument.js",
   "NotFoundException": "http/exception/not-found.js"
  },
  "Header": "http/header.js",
  "Message": "http/message.js",
  "query": {
   "extension": {
    "CommonExtension": "http/query/extension/common.js",
    "QueryExtension": "http/query/extension/extension.js"
   },
   "Validator": "http/query/validator.js"
  },
  "Request": "http/request.js",
  "response": {
   "JsonResponse": "http/response/json.js"
  },
  "Response": "http/response.js",
  "routing": {
   "MiddleWare": "http/routing/middleware.js",
   "Route": "http/routing/route.js",
   "Router": "http/routing/router.js"
  }
 },
 "logger": {
  "ConsoleLogger": "logger/console.js",
  "EmptyLogger": "logger/empty.js",
  "FileLogger": "logger/file.js",
  "LoggerInterface": "logger/interface.js"
 },
 "test": {
  "Api": "test/api.js",
  "spec": {
   "BodySpec": "test/spec/body.js",
   "HeaderSpec": "test/spec/header.js",
   "HttpSpec": "test/spec/http.js"
  },
  "Spec": "test/spec.js"
 },
 "util": {
  "Base": "util/base.js",
  "Str": "util/str.js"
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