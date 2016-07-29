declare module 'ng-local-resource' {
    let _:string;
    export = _;
}

declare namespace ngLocalResource {
    /**
     * Base options for define resource
     */
    interface ILocalResourceOptions {
        /**
         * Primary key
         */
        pk:string;

        /**
         * Unique key to resource identity
         * Some as url in angular-resource
         */
        key:string;
    }

    /**
     * Service factory
     */
    interface ILocalResourceService {
        <T>(key:string, pk:string):ILocalResourceClass<ILocalResource<T>>;
    }

    /**
     * Base class for resource with default actions
     */
    interface ILocalResourceClass<T> {
        ():T&ILocalResource<T>;

        save(model:ILocalResource<T>):IPromise<T>;
        update(model:ILocalResource<T>):IPromise<T>;
        remove(model:ILocalResource<T>):IPromise<T>;
        delete(model:ILocalResource<T>):IPromise<T>;
        get(id:string):IPromise<T>;
        query():IPromise<T[]>;
    }

    /**
     * Instance class
     */
    interface ILocalResource<T> {
        $save():IPromise<ILocalResource<T>>;
        $update():IPromise<ILocalResource<T>>;
        $remove():IPromise<T>;
        $delete():IPromise<T>;
    }

    interface ILocalResourceArray<T> extends Array<T & ILocalResource<T>> {
        $promise:IPromise<ILocalResourceArray<T>>;
        $resolved:boolean;
    }
}