declare var angular:ng.IAngularStatic;
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;

module LocalResource {
    interface IServiceConstructor {
        ();
        save(model:IServiceModel):IPromise<IServiceModel>;
        update(model:IServiceModel):IPromise<IServiceModel>;
        remove(id:string):IPromise<{}>;
        get(id:string):IPromise<IServiceModel>;
        query():IPromise<IServiceModel[]>;
    }

    export interface IServiceModel {
        $save():IPromise<IServiceModel>;
        $update():IPromise<IServiceModel>;
        $remove():IPromise<{}>;
    }

    interface ILocalResourceConfig {
        pk:string;
        key:string;
    }

    interface ILocalResourceConfigExtended extends ILocalResourceConfig {
        ();
    }

    class ServiceModelSuper {
        constructor(protected $service:IServiceConstructor, protected $config:ILocalResourceConfig) {
        }
    }

    export class ServiceModel extends ServiceModelSuper implements IServiceModel {
        constructor($service:IServiceConstructor, $config:ILocalResourceConfig) {
            super($service, $config);
        }

        $save():IPromise<IServiceModel> {
            return this.$service
                .save(this)
                .then((response) => {
                    angular.extend(this, response);
                    return this;
                });
        }

        $update():IPromise<IServiceModel> {
            return this.$service
                .update(this)
                .then((response) => {
                    angular.extend(this, response);
                    return this;
                });
        }

        $remove():IPromise<{}> {
            return this.$service.remove(this[this.$config.pk]);
        }
    }

    export interface ILocalStorageResourceService {
        (config:ILocalResourceConfig):ILocalStorageService;
    }

    export function createService(localStorage:ILocalStorageService, $q:IQService):Function {
        return function <ILocalStorageResourceService>(config:ILocalResourceConfig) {
            // Todo: Ugly hard code.
            // Hide property `config` under function instance.
            let _config = <ILocalResourceConfigExtended> function () {
            };
            _config.key = config.key;
            _config.pk = config.pk;
            config = _config;

            let service;
            service = <IServiceConstructor>function () {
                return new ServiceModel(service, config);
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
}

angular
    .module('LocalResourceModule', ['LocalStorageModule'])
    .service('$localResource', function (localStorageService:ILocalStorageService, $q:IQService) {
        return LocalResource.createService(localStorageService, $q);
    });
