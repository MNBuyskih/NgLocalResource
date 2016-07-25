describe('NgLocalResource', function () {
    beforeEach(module('MyApp'));
    beforeEach(function () {
        jasmine.addCustomEqualityTester(angular.equals);
    });
    beforeEach(inject(function (localStorageService) {
        localStorageService.clearAll();
    }));

    it('should include custom service', inject(function (MyLocalResource) {
        expect(MyLocalResource).not.toBeUndefined();
    }));

    // save
    describe('save', function () {
        it('should save new value', function () {
            var newObj = {foo: 'bar'};
            var savedObj;
            inject(function (MyLocalResource, $rootScope) {
                MyLocalResource
                    .save(newObj)
                    .then(function (response) {
                        savedObj = response;
                    });

                $rootScope.$apply();
                expect(savedObj.foo).toBe(newObj.foo);
                expect(savedObj.id).not.toBeUndefined();
            })
        });
    });

    // get
    describe('get', function () {
        var newObj = {foo: 'bar'};
        var savedObj;
        beforeEach(inject(function (MyLocalResource, $rootScope) {
            MyLocalResource.save(newObj).then(function (saved) {
                savedObj = saved;
            });
            $rootScope.$apply();
        }));

        it('should get saved value', function () {
            inject(function (MyLocalResource, $rootScope) {
                var result;
                MyLocalResource
                    .get(savedObj.id)
                    .then(function (response) {
                        result = response;
                    });

                $rootScope.$apply();
                expect(result.id).toBe(savedObj.id);
            })
        });

        it('should get null if model not exists', function () {
            inject(function (MyLocalResource, $rootScope) {
                var result;
                MyLocalResource
                    .get('not exists')
                    .then(function (response) {
                        result = response;
                    });

                $rootScope.$apply();
                expect(result).toBe(null);
            })
        });
    });

    // update
    describe('update', function () {
        var newObj = {foo: 'bar'};
        var savedObj;
        beforeEach(inject(function (MyLocalResource, $rootScope) {
            MyLocalResource.save(newObj).then(function (saved) {
                savedObj = saved;
            });
            $rootScope.$apply();
        }));

        it('should update model', inject(function (MyLocalResource, $rootScope) {
            savedObj.foo = 'new bar';
            var response;
            MyLocalResource
                .update(savedObj)
                .then(function (res) {
                    response = res;
                });

            $rootScope.$apply();
            expect(response.id).toBe(savedObj.id);
            expect(response.foo).toBe(savedObj.foo);
        }));
    });

    // remove
    describe('remove', function () {
        var newObj = {foo: 'bar'};
        var savedObj;
        beforeEach(inject(function (MyLocalResource, $rootScope) {
            MyLocalResource.save(newObj).then(function (saved) {
                savedObj = saved;
            });
            $rootScope.$apply();
        }));

        it('should remove model', inject(function (MyLocalResource, $rootScope) {
            var response;
            MyLocalResource
                .remove(savedObj.id)
                .then(function (res) {
                    response = res;
                });

            $rootScope.$apply();
            expect(response).toBeUndefined();

            MyLocalResource
                .get(savedObj.id)
                .then(function (res) {
                    response = res;
                });

            $rootScope.$apply();
            expect(response).toBeNull();
        }));
    });

    // query
    describe('query', function () {
        beforeEach(inject(function (MyLocalResource, $rootScope) {
            [0, 1, 2, 3, 4].forEach(function (n) {
                MyLocalResource.save({foo: 'n:' + n});
            });
            $rootScope.$apply();
        }));

        it('should return all models', inject(function (MyLocalResource, $rootScope) {
            var result;
            MyLocalResource
                .query()
                .then(function (response) {
                    result = response;
                });

            $rootScope.$apply();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(5);
            expect(result[0].foo).toBe('n:0');
            expect(result[4].foo).toBe('n:4');
        }));
    });
});

describe('NgLocalResourceModel', function () {
    beforeEach(module('MyApp'));
    beforeEach(function () {
        jasmine.addCustomEqualityTester(angular.equals);
    });
    beforeEach(inject(function (localStorageService) {
        localStorageService.clearAll();
    }));

    describe('$save', function () {
        it('should create new instance', inject(function (MyLocalResource, $rootScope) {
            var newObj = new MyLocalResource();
            var sm = LocalResource.ServiceModel;
            expect(newObj instanceof sm).toBe(true);
        }));

        it('should save new instance', inject(function (MyLocalResource, $rootScope) {
            var response;
            var newObj = new MyLocalResource();
            newObj.foo = 'bar';
            newObj.$save().then(function (res) {
                response = res;
            });
            $rootScope.$apply();
            expect(response.foo).toBe('bar');
            expect(response.id).not.toBeUndefined();
        }));
    });

    describe('$update', function () {
        it('should update existing instance', inject(function (MyLocalResource, $rootScope) {
            var id;
            var newObj = new MyLocalResource();
            newObj.foo = 'bar';
            newObj.$save().then(function (res) {
                newObj = res;
                id = newObj.id;
            });
            $rootScope.$apply();

            var updated;
            newObj.foo = 'rab';
            newObj.$update().then(function (res) {
                updated = res;
            });

            $rootScope.$apply();
            expect(updated.foo).toBe(newObj.foo);
            expect(updated.id).toBe(newObj.id);
        }));
    });

    describe('$remove', function () {
        it('should remove existing instance', inject(function (MyLocalResource, $rootScope) {
            var newObj = new MyLocalResource();
            newObj.$save().then(function (res) {
                newObj = res;
            });
            $rootScope.$apply();

            newObj.$remove();
            $rootScope.$apply();

            var found;
            MyLocalResource.get(newObj.id).then(function (ret) {
                found = ret;
            });
            $rootScope.$apply();
            expect(found).toBe(null);
        }));
    });
});