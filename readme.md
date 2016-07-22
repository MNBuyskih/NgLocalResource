#Usage 

```html
<script src="angular/angular.js"></script>
<script src="angular-local-storage/dist/angular-local-storage.min.js"></script>
<script src="ng-local-resource/dest/index.js"></script>
<script>
var app = angular.module('MyApp', ['ng-local-resource']);
app.service('MyLocalResource', function($localResource){
    return $localResource('myLocalResourceKey', {
        prefix: 'myLocalResourcePrefix',
        pk: 'id';
        createId: true;
    });
});

app.contrroller('MyController', function(MyLocalResource){
    MyLocalResource.query().then((data) => {
        // do anything with data
        
        data[0].someField = 'some value';
        data[0].$update(); // or data[0].$save();
    });
    
    var myNewModel = new MyLocalResource();
    myNewModel.someField = 'some value';
    myNewModel.$save().then((savedModel) => console.log(savedModel.id)); // => <new model id> 
});
</script>
```