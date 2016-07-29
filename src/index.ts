declare var angular:ng.IAngularStatic;
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;
import ILocalResourceOptions = ngLocalResource.ILocalResourceOptions;

module LocalResource {
    import ILocalResourceService = ngLocalResource.ILocalResourceService;
    import ILocalResourceClass = ngLocalResource.ILocalResourceClass;
    import ILocalResource = ngLocalResource.ILocalResource;
    import ILocalResourceArray = ngLocalResource.ILocalResourceArray;

    class LocalResource<T> implements ILocalResource<T> {
        constructor(private service:ILocalResourceClass<T>) {
        }

        $save():IPromise<ILocalResource<T>> {
            return this.service
                .save(this)
                .then((response) => {
                    angular.extend(this, response);
                    return this;
                });
        }

        $update():IPromise<ILocalResource<T>> {
            return this.service
                .update(this)
                .then((response) => {
                    angular.extend(this, response);
                    return this;
                });
        }

        $remove():IPromise<T> {
            return this.service.remove(this);
        }

        $delete():IPromise<T> {
            return this.$remove();
        }
    }

    export function createService($localStorage:ILocalStorageService, $q):ILocalResourceService {
        return function <T>(key:string, pk:string = 'id'):ILocalResourceClass<ILocalResource<T>> {
            let service;
            service = <ILocalResourceClass<LocalResource<T>>>function () {
                return new LocalResource(service);
            };
            service.save = function (model) {
                if (model[pk] === undefined) model[pk] = _createPk();
                _set(model[pk], model);
                return this.get(model[pk]);
            };
            service.update = function (model:T):IPromise<T> {
                _set(model[pk], model);
                return this.get(model[pk]);
            };
            service.remove = function (model:T):IPromise<T> {
                return $q.resolve($localStorage.remove(_createKey(model[pk])));
            };
            service.get = function (id:string):IPromise<T> {
                return _get(id);
            };
            service.query = function ():IPromise<T[]> {
                return $q.all($localStorage
                    .keys()
                    .filter((k) => k.indexOf(key) > -1)
                    .map((k) => _get(k.replace(key, ''))));
            };

            function _set(key:string, value):boolean {
                return $localStorage.set(_createKey(key), value);
            }

            function _get(id:string):IPromise<T> {
                return $q.resolve($localStorage.get(_createKey(id)));
            }

            function _createPk():string {
                return ($localStorage.length() + 1).toString();
            }

            function _createKey(id:string):string {
                return `${key}${id}`;
            }

            return service;
        }
    }
}

angular
    .module('LocalResourceModule', ['LocalStorageModule'])
    .service('$localResource', function (localStorageService:ILocalStorageService, $q:IQService) {
        return LocalResource.createService(localStorageService, $q);
    });
