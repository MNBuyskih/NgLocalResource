var LocalResource;
(function (LocalResource) {
    function createService(localStorage, $q) {
        return function (config) {
            var service = function () {
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