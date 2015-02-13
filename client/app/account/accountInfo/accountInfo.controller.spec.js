'use strict';

describe('Controller: AccountinfoCtrl', function () {

    // load the controller's module
    beforeEach(module('umm3601ursamajorApp'));

    var AccountinfoCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AccountinfoCtrl = $controller('AccountinfoCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function () {
        expect(1).toEqual(1);
    });
});
