var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("index", ['angular'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1;
    var NgLocalResourceModel, NgLocalResourceModelAbstract, NgLocalResource;
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
            NgLocalResourceModel = (function (_super) {
                __extends(NgLocalResourceModel, _super);
                function NgLocalResourceModel() {
                    _super.apply(this, arguments);
                }
                return NgLocalResourceModel;
            }(NgLocalResourceModelAbstract));
            exports_1("NgLocalResourceModel", NgLocalResourceModel);
            NgLocalResourceModelAbstract = (function () {
                function NgLocalResourceModelAbstract() {
                }
                NgLocalResourceModelAbstract.prototype.$save = function () {
                    return this.$resource.save(this);
                };
                NgLocalResourceModelAbstract.prototype.$update = function () {
                    return this.$resource.update(this);
                };
                NgLocalResourceModelAbstract.prototype.$remove = function () {
                    return this.$resource.remove(this[this.$resource.config.pk]);
                };
                NgLocalResourceModelAbstract.create = function (object, resource) {
                    var self = new NgLocalResourceModel();
                    self.$resource = resource;
                    angular_1.default.extend(self, object);
                    return self;
                };
                return NgLocalResourceModelAbstract;
            }());
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
                NgLocalResource.prototype.update = function (element) {
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
                    var value = this.service.get("" + this.config.prefix + this.key + id);
                    value = NgLocalResourceModelAbstract.create(value, this);
                    return value;
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