import angular from 'angular';
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;

export class NgLocalResource<T> {
    constructor(private key:string, private config:INgLocalResourceConfig, private service:ILocalStorageService, private $q:IQService) {
    }

    get(id):IPromise<T> {
        let value = this._get(id);
        return this._promise<T>(value);
    }

    save(element:T):IPromise<T> {
        if (element[this.config.pk] === undefined && this.config.createId)
            element[this.config.pk] = this.createId();

        this.service.set(element[this.config.pk], element);
        return this.get(element[this.config.pk]);
    }

    query():IPromise<T[]> {
        let value = this.service.keys()
            .filter((key) => key.indexOf(this.config.prefix) > -1)
            .map((key) => this._get(key));
        return this._promise<T[]>(value);
    }

    remove(id):IPromise<T> {
        var value = this.service.remove(id);
        return this._promise(value);
    }

    private _promise<U>(value):IPromise<U> {
        let q = this.$q.defer();
        q.resolve(value);
        return q.promise;
    }

    private _get(id:string) {
        return this.service.get(`${this.config.prefix}${this.key}${id}`);
    }

    private createId():number {
        return this.service.length() + 1;
    }
}

export interface INgLocalResourceConfig {
    prefix:string;
    pk:string;
    createId:boolean;
}

export function $localResource<T>(localStorageService:ILocalStorageService, $q:IQService):Function {
    return function (key:string, config:INgLocalResourceConfig) {
        return new NgLocalResource<T>(key, config, localStorageService, $q);
    }
}

angular
    .module('ng-local-resource', ['LocalStorageModule'])
    .service('$localResource', $localResource);