var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NgLocalResource;
(function (NgLocalResource_1) {
    "use strict";
    var NgLocalResourceModelAbstract = (function () {
        function NgLocalResourceModelAbstract($resource) {
            this.$resource = $resource;
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
            var self = new NgLocalResourceModel(resource);
            angular.extend(self, object);
            return self;
        };
        return NgLocalResourceModelAbstract;
    }());
    var NgLocalResourceModel = (function (_super) {
        __extends(NgLocalResourceModel, _super);
        function NgLocalResourceModel() {
            _super.apply(this, arguments);
        }
        return NgLocalResourceModel;
    }(NgLocalResourceModelAbstract));
    NgLocalResource_1.NgLocalResourceModel = NgLocalResourceModel;
    var NgLocalResource = (function () {
        function NgLocalResource(key, config, service, $q) {
            this.key = key;
            this.config = config;
            this.service = service;
            this.$q = $q;
        }
        NgLocalResource.prototype.get = function (id) {
            var value = this._get(id);
            return this.$q.resolve(value);
        };
        NgLocalResource.prototype.save = function (element) {
            if (element[this.config.pk] === undefined && this.config.createId)
                element[this.config.pk] = this.createId();
            this._set(this.createKey(element[this.config.pk]), element);
            return this.get(element[this.config.pk]);
        };
        NgLocalResource.prototype.update = function (element) {
            this._set(this.createKey(element[this.config.pk]), element);
            return this.get(element[this.config.pk]);
        };
        NgLocalResource.prototype.query = function () {
            var _this = this;
            var keyBegin = this.createKey('');
            var value = this.service.keys()
                .filter(function (key) { return key.indexOf(keyBegin) > -1; })
                .map(function (key) { return _this._get(key.replace(keyBegin, '')); });
            return this._promise(value);
        };
        NgLocalResource.prototype.remove = function (id) {
            var value = this.service.remove(this.createKey(id));
            return this._promise(value);
        };
        NgLocalResource.prototype._promise = function (value) {
            return this.$q.resolve(value);
        };
        NgLocalResource.prototype._get = function (id) {
            var value = this.service.get(this.createKey(id));
            value = value && NgLocalResourceModelAbstract.create(value, this);
            return value;
        };
        NgLocalResource.prototype._set = function (key, element) {
            var clone = {};
            angular.copy(element, clone);
            clone['$resource'] = undefined;
            this.service.set(key, clone);
        };
        NgLocalResource.prototype.createId = function () {
            return this.service.length() + 1;
        };
        NgLocalResource.prototype.createKey = function (id) {
            return "" + this.config.prefix + this.key + id;
        };
        return NgLocalResource;
    }());
    NgLocalResource_1.NgLocalResource = NgLocalResource;
    function $localResource(localStorageService, $q) {
        return function (key, config) {
            var inst = function () {
            };
            inst.$resource = new NgLocalResource(key, config, localStorageService, $q);
            inst.save = function (element) {
                return this.$resource.save(element);
            };
            return inst;
        };
    }
    NgLocalResource_1.$localResource = $localResource;
    angular
        .module('ng-local-resource', ['LocalStorageModule'])
        .service('$localResource', $localResource);
})(NgLocalResource || (NgLocalResource = {}));
//# sourceMappingURL=index.js.map