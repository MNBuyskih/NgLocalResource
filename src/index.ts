declare var angular:ng.IAngularStatic;
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;

module NgLocalResource {
    "use strict";

    abstract class NgLocalResourceModelAbstract<T> {
        constructor(private $resource:NgLocalResource<T>) {
        }

        $save():IPromise<T> {
            return this.$resource.save(this);
        }

        $update():IPromise<T> {
            return this.$resource.update(this);
        }

        $remove():IPromise<T> {
            return this.$resource.remove(this[this.$resource.config.pk]);
        }

        static create(object, resource) {
            let self = new NgLocalResourceModel(resource);
            angular.extend(self, object);
            return self;
        }
    }

    export interface INgLocalResourceModel<T> {
        $save():IPromise<T>;
        $update():IPromise<T>;
        $remove():IPromise<T>;
    }

    export interface INgLocalResource<T> {
        get(id):IPromise<T>;
        save(element:T):IPromise<T>;
        update(element:T):IPromise<T>;
        query():IPromise<T[]>;
        remove(id):IPromise<T>;
    }

    export class NgLocalResourceModel<T> extends NgLocalResourceModelAbstract<T> implements INgLocalResourceModel<T> {
    }
    export class NgLocalResource<T> implements INgLocalResource<T> {
        constructor(public key:string, public config:INgLocalResourceConfig, private service:ILocalStorageService, private $q:IQService) {
        }

        get(id):IPromise<T> {
            let value = this._get(id);
            return this.$q.resolve(value);
        }

        save(element:T):IPromise<T> {
            if (element[this.config.pk] === undefined && this.config.createId) element[this.config.pk] = this.createId();

            this._set(this.createKey(element[this.config.pk]), element);
            return this.get(element[this.config.pk]);
        }

        update(element:T):IPromise<T> {
            this._set(this.createKey(element[this.config.pk]), element);
            return this.get(element[this.config.pk]);
        }

        query():IPromise<T[]> {
            var keyBegin = this.createKey('');
            let value = this.service.keys()
                .filter((key) => key.indexOf(keyBegin) > -1)
                .map((key) => this._get(key.replace(keyBegin, '')));
            return this._promise<T[]>(value);
        }

        remove(id):IPromise<T> {
            var value = this.service.remove(this.createKey(id));
            return this._promise(value);
        }

        private _promise<U>(value):IPromise<U> {
            return this.$q.resolve(value);
        }

        private _get(id:string) {
            var value = this.service.get(this.createKey(id));
            value = value && NgLocalResourceModelAbstract.create(value, this);
            return value;
        }

        private _set(key:string, element:T) {
            var clone = {};
            angular.copy(element, clone);
            clone['$resource'] = undefined;
            this.service.set(key, clone);
        }

        private createId():number {
            return this.service.length() + 1;
        }

        private createKey(id):string {
            return `${this.config.prefix}${this.key}${id}`;
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
}