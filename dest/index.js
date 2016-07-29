var LocalResource;
(function (LocalResource_1) {
    var LocalResource = (function () {
        function LocalResource(service) {
            this.service = service;
        }
        LocalResource.prototype.$save = function () {
            var _this = this;
            return this.service
                .save(this)
                .then(function (response) {
                angular.extend(_this, response);
                return _this;
            });
        };
        LocalResource.prototype.$update = function () {
            var _this = this;
            return this.service
                .update(this)
                .then(function (response) {
                angular.extend(_this, response);
                return _this;
            });
        };
        LocalResource.prototype.$remove = function () {
            return this.service.remove(this);
        };
        LocalResource.prototype.$delete = function () {
            return this.$remove();
        };
        return LocalResource;
    }());
    function createService($localStorage, $q) {
        return function (key, pk) {
            if (pk === void 0) { pk = 'id'; }
            var service;
            service = function () {
                return new LocalResource(service);
            };
            service.save = function (model) {
                if (model[pk] === undefined)
                    model[pk] = _createPk();
                _set(model[pk], model);
                return this.get(model[pk]);
            };
            service.update = function (model) {
                _set(model[pk], model);
                return this.get(model[pk]);
            };
            service.remove = function (model) {
                return $q.resolve($localStorage.remove(_createKey(model[pk])));
            };
            service.get = function (id) {
                return _get(id);
            };
            service.query = function () {
                return $q.all($localStorage
                    .keys()
                    .filter(function (key) { return key.indexOf(key) > -1; })
                    .map(function (k) { return _get(k.replace(key, '')); }));
            };
            function _set(key, value) {
                return $localStorage.set(_createKey(key), value);
            }
            function _get(id) {
                return $q.resolve($localStorage.get(_createKey(id)));
            }
            function _createPk() {
                return ($localStorage.length() + 1).toString();
            }
            function _createKey(id) {
                return "" + key + id;
            }
            return service;
        };
    }
    LocalResource_1.createService = createService;
})(LocalResource || (LocalResource = {}));
angular
    .module('LocalResourceModule', ['LocalStorageModule'])
    .service('$localResource', function (localStorageService, $q) {
    return LocalResource.createService(localStorageService, $q);
});
//# sourceMappingURL=index.js.map