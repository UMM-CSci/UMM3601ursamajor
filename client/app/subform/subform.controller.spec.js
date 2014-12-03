'use strict';

describe('Controller: SubformCtrl', function () {

  // load the controller's module
  beforeEach(module('umm3601ursamajorApp'));
  beforeEach(module('socketMock'));


    var SubformCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubformCtrl = $controller('SubformCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });

  it('Should convert arrays for submission list', function() {
    var testSponsors_1 = [
        "UROP",
        "Kittens"
    ];
    var testSponsors_2 = [
        "MAP",
        "MMP"
    ];
    var testSponsors_3 = [
        "Kittens"
    ];
    var testSponsors_4 = [
        "UROP",
        "MAP",
        "MMP",
        "LSAMP",
        "Kittens"
    ];

    expect(scope.convertSponsorArray([])).toEqual(["", "", "", ""]);
    expect(scope.convertSponsorArray(testSponsors_1)).toEqual(["UROP", "", "", "", "Kittens"]);
    expect(scope.convertSponsorArray(testSponsors_2)).toEqual(["", "MAP", "MMP", ""]);
    expect(scope.convertSponsorArray(testSponsors_3)).toEqual(["", "", "", "", "Kittens"]);
    expect(scope.convertSponsorArray(testSponsors_4)).toEqual(["UROP", "MAP", "MMP", "LSAMP", "Kittens"]);
  });

  it('Initial submission should have false resubmit flag', function() {
      expect(scope.submissionData.resubmitFlag).toEqual(false);
  });



});
