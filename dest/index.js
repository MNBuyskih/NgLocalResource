var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LocalResource;
(function (LocalResource) {
    var ServiceModelSuper = (function () {
        function ServiceModelSuper($service, $config) {
            this.$service = $service;
            this.$config = $config;
        }
        return ServiceModelSuper;
    }());
    var ServiceModel = (function (_super) {
        __extends(ServiceModel, _super);
        function ServiceModel($service, $config) {
            _super.call(this, $service, $config);
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
    }(ServiceModelSuper));
    LocalResource.ServiceModel = ServiceModel;
    function createService(localStorage, $q) {
        return function (config) {
            // Todo: Ugly hard code.
            // Hide property `config` under function instance.
            var _config = function () {
            };
            _config.key = config.key;
            _config.pk = config.pk;
            config = _config;
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
    LocalResource.createService = createService;
})(LocalResource || (LocalResource = {}));
angular
    .module('LocalResourceModule', ['LocalStorageModule'])
    .service('$localResource', function (localStorageService, $q) {
    return LocalResource.createService(localStorageService, $q);
});
var app = angular.module('MyApp', ['LocalResourceModule']);
app.service('MyLocal', function ($localResource) {
    return $localResource({
        pk: 'id',
        key: 'my'
    });
});
app.controller('MyController', MyController);
var MyController = (function () {
    function MyController(MyLocal) {
        this.MyLocal = MyLocal;
        var my = new MyLocal();
        my.foo = 'bar';
        my.$save();
    }
    return MyController;
}());
//# sourceMappingURL=index.js.map