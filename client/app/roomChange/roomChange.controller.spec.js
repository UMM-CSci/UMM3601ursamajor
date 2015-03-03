'use strict';

describe('Controller: RoomChangeCtrl', function () {

  // load the controller's module
  beforeEach(module('umm3601ursamajorApp'));

  var RoomChangeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RoomChangeCtrl = $controller('RoomChangeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
