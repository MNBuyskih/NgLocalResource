import ILocalStorageResourceService = LocalResource.ILocalStorageResourceService;
import IServiceModel = LocalResource.IServiceModel;

let app = angular.module('MyApp', ['LocalResourceModule']);
app.service('MyLocal', ($localResource:ILocalStorageResourceService)=> {
    return $localResource({
        pk: 'id',
        key: 'my'
    });
});
app.controller('MyController', MyController);

class MyController {
    constructor(private MyLocal:MyLocalInstance) {
        let my = new MyLocal();
        my.foo = 'bar';
        my.$save();
    }
}

declare interface MyLocalInstance extends IServiceModel {
    new ();
    foo:string;
}