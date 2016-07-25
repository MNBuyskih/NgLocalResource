var LocalResource;
(function (LocalResource) {
    var ServiceModel = (function () {
        function ServiceModel($service, $config) {
            this.$service = $service;
            this.$config = $config;
        }
        ServiceModel.prototype.$save = function () {
            var _this = this;
            return this.$service
                .save(this)
                .then(function (response) {
                angular.extend(_this, response);
                return _this;
            });
        };
        ServiceModel.prototype.$update = function () {
            var _this = this;
            return this.$service
                .update(this)
                .then(function (response) {
                angular.extend(_this, response);
                return _this;
            });
        };
        ServiceModel.prototype.$remove = function () {
            return this.$service.remove(this[this.$config.pk]);
        };
        return ServiceModel;
    }());
    LocalResource.ServiceModel = ServiceModel;
    function createService(localStorage, $q) {
        return function (config) {
            var service;
            service = function () {
                return new ServiceModel(service, config);
            };
            service.save = function (model) {
                if (model[config.pk] === undefined)
                    model[config.pk] = _createPk();
                _set(model[config.pk], model);
                return this.get(model[config.pk]);
            };
            service.update = function (model) {
                _set(model[config.pk], model);
                return this.get(model[config.pk]);
            };
            service.remove = function (id) {
                return $q.resolve(localStorage.remove(_createKey(id)));
            };
            service.get = function (id) {
                return _get(id);
            };
            service.query = function () {
                return $q.all(localStorage
                    .keys()
                    .filter(function (key) {
                    return key.indexOf(config.key) > -1;
                })
                    .map(function (key) { return _get(key.replace(config.key, '')); }));
            };
            return service;
            function _get(id) {
                return $q.resolve(localStorage.get(_createKey(id)));
            }
            function _set(key, value) {
                return localStorage.set(_createKey(key), value);
            }
            function _createKey(id) {
                return "" + config.key + id;
            }
            function _createPk() {
                return (localStorage.length() + 1).toString();
            }
        };
    }
    angular
        .module('LocalResourceModule', ['LocalStorageModule'])
        .service('$localResource', function (localStorageService, $q) {
        return createService(localStorageService, $q);
    });
})(LocalResource || (LocalResource = {}));
//# sourceMappingURL=index.js.map