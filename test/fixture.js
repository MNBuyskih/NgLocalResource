var app = angular.module('MyApp', ['LocalResourceModule']);
app.service('MyLocalResource', function ($localResource) {
    return $localResource('myLocalResourcePrefix');
});