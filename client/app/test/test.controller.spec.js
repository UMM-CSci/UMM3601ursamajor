'use strict';

describe('Controller: TestCtrl', function () {

  // load the controller's module
  beforeEach(module('umm3601ursamajorApp'));

  var TestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestCtrl = $controller('TestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
/*
  it('should add comment', function () {
    var selection = window.getSelection();
    expect(var commentText).toEqual(prompt("Comment"));
  });*/
});
