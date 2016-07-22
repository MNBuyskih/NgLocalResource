declare var angular:ng.IAngularStatic;
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;

module LocalResource {
    interface IServiceConstructor {
        ();
        save(model:IServiceModel):IPromise<IServiceModel>;
        update(model:IServiceModel):IPromise<IServiceModel>;
        remove(id:string):IPromise<IServiceModel>;
        get(id:string):IPromise<IServiceModel>;
        query():IPromise<IServiceModel[]>;
    }

    interface IServiceModel {

    }

    interface ILocalResourceConfig {
        pk:string;
        key:string;
    }

    function createService(localStorage:ILocalStorageService, $q:IQService):Function {
        return function (config:ILocalResourceConfig) {
            let service = <IServiceConstructor>function () {
            };
            service.save = function (model:IServiceModel):IPromise<IServiceModel> {
                if (model[config.pk] === undefined) model[config.pk] = _createPk();
                _set(model[config.pk], model);
                return this.get(model[config.pk]);
            };
            service.update = function (model:IServiceModel):IPromise<IServiceModel> {
                _set(model[config.pk], model);
                return this.get(model[config.pk]);
            };
            service.remove = function (id:string):IPromise<{}> {
                return $q.resolve(localStorage.remove(_createKey(id)));
            };
            service.get = function (id:string):IPromise<IServiceModel> {
                return _get(id);
            };
            service.query = function ():IPromise<IServiceModel[]> {
                return $q.all(localStorage
                    .keys()
                    .filter((key) => {
                        return key.indexOf(config.key) > -1;
                    })
                    .map((key) => _get(key.replace(config.key, ''))));
            };

            return service;

            function _get(id:string):IPromise<IServiceModel> {
                return $q.resolve(localStorage.get(_createKey(id)));
            }

            function _set(key:string, value):boolean {
                return localStorage.set(_createKey(key), value);
            }

            function _createKey(id:string):string {
                return `${config.key}${id}`;
            }

            function _createPk():string {
                return (localStorage.length() + 1).toString();
            }
        };
    }

    angular
        .module('LocalResourceModule', ['LocalStorageModule'])
        .service('$localResource', function (localStorageService:ILocalStorageService, $q:IQService) {
            return createService(localStorageService, $q);
        });
}