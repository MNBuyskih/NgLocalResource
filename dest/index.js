System.register("index", ['angular'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1;
    var NgLocalResource;
    function $localResource(localStorageService, $q) {
        return function (key, config) {
            return new NgLocalResource(key, config, localStorageService, $q);
        };
    }
    exports_1("$localResource", $localResource);
    return {
        setters:[
            function (angular_1_1) {
                angular_1 = angular_1_1;
            }],
        execute: function() {
            NgLocalResource = (function () {
                function NgLocalResource(key, config, service, $q) {
                    this.key = key;
                    this.config = config;
                    this.service = service;
                    this.$q = $q;
                }
                NgLocalResource.prototype.get = function (id) {
                    var value = this._get(id);
                    return this._promise(value);
                };
                NgLocalResource.prototype.save = function (element) {
                    if (element[this.config.pk] === undefined && this.config.createId)
                        element[this.config.pk] = this.createId();
                    this.service.set(element[this.config.pk], element);
                    return this.get(element[this.config.pk]);
                };
                NgLocalResource.prototype.query = function () {
                    var _this = this;
                    var value = this.service.keys()
                        .filter(function (key) { return key.indexOf(_this.config.prefix) > -1; })
                        .map(function (key) { return _this._get(key); });
                    return this._promise(value);
                };
                NgLocalResource.prototype.remove = function (id) {
                    var value = this.service.remove(id);
                    return this._promise(value);
                };
                NgLocalResource.prototype._promise = function (value) {
                    var q = this.$q.defer();
                    q.resolve(value);
                    return q.promise;
                };
                NgLocalResource.prototype._get = function (id) {
                    return this.service.get("" + this.config.prefix + this.key + id);
                };
                NgLocalResource.prototype.createId = function () {
                    return this.service.length() + 1;
                };
                return NgLocalResource;
            }());
            exports_1("NgLocalResource", NgLocalResource);
            angular_1.default
                .module('ng-local-resource', ['LocalStorageModule'])
                .service('$localResource', $localResource);
        }
    }
});
//# sourceMappingURL=index.js.map