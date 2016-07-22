var app = angular.module('MyApp', ['ng-local-resource']);
app.service('MyLocalResource', function ($localResource) {
    return $localResource('myLocalResourceKey', {
        prefix: 'myLocalResourcePrefix',
        pk: 'id',
        createId: true,
    });
});