'use strict';

describe('Controller: GroupChangeCtrl', function () {

  // load the controller's module
  beforeEach(module('umm3601ursamajorApp'));
  beforeEach(module('socketMock'));

  var GroupChangeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GroupChangeCtrl = $controller('GroupChangeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
