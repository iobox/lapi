// AUTO GENERATED ==>
var $exports = {
 "Collection": "collection.js",
 "DB": {
  "Db": "db/db.js",
  "Driver": {
   "MongoDb": "db/driver/mongo.js"
  },
  "Model": "db/model.js",
  "Repository": "db/repository.js",
  "Schema": "db/schema.js"
 },
 "DI": {
  "ContainerAware": "di/container-aware.js",
  "Container": "di/container.js"
 },
 "Event": {
  "EventListener": "event/listener.js",
  "EventManager": "event/manager.js"
 },
 "Exception": {
  "Exception": "exception/exception.js",
  "InternalErrorException": "exception/internal-error.js",
  "InvalidArgumentException": "exception/invalid-argument.js",
  "NotFoundException": "exception/not-found.js",
  "NotImplementedException": "exception/not-implemented.js"
 },
 "Foundation": {
  "App": "foundation/app.js",
  "Bag": "foundation/bag.js",
  "Controller": "foundation/controller.js",
  "Extension": {
   "Extension": "foundation/extension/extension.js",
   "KernelExtension": "foundation/extension/kernel.js",
   "ExtensionManager": "foundation/extension/manager.js",
   "ModuleExtension": "foundation/extension/module.js"
  }
 },
 "Http": {
  "Body": "http/body.js",
  "Exception": {
   "HttpException": "http/exception/http.js",
   "InvalidArgumentException": "http/exception/invalid-argument.js",
   "NotFoundException": "http/exception/not-found.js"
  },
  "Header": "http/header.js",
  "Message": "http/message.js",
  "Query": {
   "Extension": {
    "CommonExtension": "http/query/extension/common.js",
    "QueryExtension": "http/query/extension/extension.js"
   },
   "Validator": "http/query/validator.js"
  },
  "Request": "http/request.js",
  "Response": {
   "JsonResponse": "http/response/json.js",
   "Response": "http/response/response.js"
  },
  "Routing": {
   "Route": "http/routing/route.js",
   "Router": "http/routing/router.js"
  }
 },
 "Logger": {
  "ConsoleLogger": "logger/console.js",
  "FileLogger": "logger/file.js",
  "LoggerInterface": "logger/interface.js"
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