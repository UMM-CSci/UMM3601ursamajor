'use strict';

describe('Controller: AbstractbookCtrl', function () {

  // load the controller's module
  beforeEach(module('umm3601ursamajorApp'));

  var AbstractbookCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AbstractbookCtrl = $controller('AbstractbookCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
