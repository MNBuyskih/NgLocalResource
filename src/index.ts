declare var angular:ng.IAngularStatic;
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import IQService = angular.IQService;
import IPromise = angular.IPromise;

module NgLocalResource {
    "use strict";

    abstract class NgLocalResourceModelAbstract {
        constructor(private $resource:NgLocalResource) {

        }

        $save():IPromise<NgLocalResource> {
            return this.$resource.save(this);
        }

        $update():IPromise<NgLocalResource> {
            return this.$resource.update(this);
        }

        $remove():IPromise<NgLocalResource> {
            return this.$resource.remove(this[this.$resource.config.pk]);
        }

        static create(object, resource) {
            let self = new NgLocalResourceModel(resource);
            angular.extend(self, object);
            return self;
        }
    }

    export interface INgLocalResourceModel {
        $save():IPromise<INgLocalResourceModel>;
        $update():IPromise<INgLocalResourceModel>;
        $remove():IPromise<INgLocalResourceModel>;
    }

    export interface INgLocalResource {
        get(id):IPromise<INgLocalResource>;
        save(element:INgLocalResource):IPromise<INgLocalResource>;
        update(element:INgLocalResource):IPromise<INgLocalResource>;
        query():IPromise<INgLocalResource[]>;
        remove(id):IPromise<INgLocalResource>;
    }

    export class NgLocalResourceModel extends NgLocalResourceModelAbstract implements INgLocalResourceModel {
    }
    export class NgLocalResource implements INgLocalResource {
        constructor(public key:string, public config:INgLocalResourceConfig, private service:ILocalStorageService, private $q:IQService) {
        }

        get(id):IPromise<NgLocalResource> {
            let value = this._get(id);
            return this.$q.resolve(value);
        }

        save(element:NgLocalResource):IPromise<NgLocalResource> {
            if (element[this.config.pk] === undefined && this.config.createId) element[this.config.pk] = this.createId();

            this._set(this.createKey(element[this.config.pk]), element);
            return this.get(element[this.config.pk]);
        }

        update(element:NgLocalResource):IPromise<NgLocalResource> {
            this._set(this.createKey(element[this.config.pk]), element);
            return this.get(element[this.config.pk]);
        }

        query():IPromise<NgLocalResource[]> {
            var keyBegin = this.createKey('');
            let value = this.service.keys()
                .filter((key) => key.indexOf(keyBegin) > -1)
                .map((key) => this._get(key.replace(keyBegin, '')));
            return this._promise<NgLocalResource[]>(value);
        }

        remove(id):IPromise<NgLocalResource> {
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

        private _set(key:string, element:NgLocalResource) {
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

    export interface INgLocalResourceConstructor {
        ();
        save():IPromise;
        $resource:INgLocalResource;
    }

    export function $localResource(localStorageService:ILocalStorageService, $q:IQService):Function {
        return function (key:string, config:INgLocalResourceConfig) {
            let inst = <INgLocalResourceConstructor>function () {
            };
            inst.$resource = new NgLocalResource(key, config, localStorageService, $q);
            inst.save = function (element):IPromise {
                return this.$resource.save(element);
            };

            return inst;
        }
    }

    angular
        .module('ng-local-resource', ['LocalStorageModule'])
        .service('$localResource', $localResource);
}