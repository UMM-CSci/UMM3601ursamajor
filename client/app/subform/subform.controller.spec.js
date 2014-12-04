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


  it('Should return true since all emails are U of M emails.', function() {
      scope.submissionData.presenterInfo.email = "billy557@morris.umn.edu";
      scope.submissionData.copresenterOne.email = "george@umn.edu";
      scope.submissionData.copresenterTwo.email = "franklin17@rochester.umn.edu";
      scope.submissionData.adviserInfo.email = "jane875@umn.edu";
      scope.submissionData.coadviserOneInfo.email = "johnx117@umn.edu";
      scope.submissionData.coadviserTwoInfo.email = "svenx994@morris.umn.edu";

      expect(scope.checkEmailsAreUofM()).toEqual(true);
  });

    it('Should return false since there is a non-umn email', function() {
        scope.submissionData.presenterInfo.email = "billy557@morris.umn.edu";
        scope.submissionData.copresenterOne.email = "george@umn.edu";
        scope.submissionData.copresenterTwo.email = "franklin17@rochester.umn.edu";
        scope.submissionData.adviserInfo.email = "jane875@live.com";
        scope.submissionData.coadviserOneInfo.email = "johnx117@umn.edu";
        scope.submissionData.coadviserTwoInfo.email = "svenx994@morris.umn.edu";

        expect(scope.checkEmailsAreUofM()).toEqual(false);
    });

    it('Should return false since there are multiple non-umn emails. Tests with gmail emails and other edu emails.', function() {
        scope.submissionData.presenterInfo.email = "billy557@morris.umn.edu";
        scope.submissionData.copresenterOne.email = "george@wisconsin.edu";
        scope.submissionData.copresenterTwo.email = "franklin17@rochester.umn.edu";
        scope.submissionData.adviserInfo.email = "jane875@live.com";
        scope.submissionData.coadviserOneInfo.email = "johnx117@army.gov";
        scope.submissionData.coadviserTwoInfo.email = "svenx994@gmail.com";

        expect(scope.checkEmailsAreUofM()).toEqual(false);
    });

    it('Should return true since all emails are morris emails', function() {
        scope.submissionData.presenterInfo.email = "billy557@morris.umn.edu";
        scope.submissionData.copresenterOne.email = "george@morris.umn.edu";
        scope.submissionData.copresenterTwo.email = "franklin17@morris.umn.edu";
        scope.submissionData.adviserInfo.email = "jane875@morris.umn.edu";
        scope.submissionData.coadviserOneInfo.email = "johnx117@morris.umn.edu";
        scope.submissionData.coadviserTwoInfo.email = "svenx994@morris.umn.edu";

        expect(scope.checkEmailsAreMorris()).toEqual(true);
    });

    it('Should return false since there is a TC email.', function() {
        scope.submissionData.presenterInfo.email = "billy557@umn.edu";
        scope.submissionData.copresenterOne.email = "george@morris.umn.edu";
        scope.submissionData.copresenterTwo.email = "franklin17@morris.umn.edu";
        scope.submissionData.adviserInfo.email = "jane875@morris.umn.edu";
        scope.submissionData.coadviserOneInfo.email = "johnx117@morris.umn.edu";
        scope.submissionData.coadviserTwoInfo.email = "svenx994@morris.umn.edu";

        expect(scope.checkEmailsAreMorris()).toEqual(false);
    });

    it('Should return false since there is a gmail email.', function() {
        scope.submissionData.presenterInfo.email = "billy557@gmail.com";
        scope.submissionData.copresenterOne.email = "george@morris.umn.edu";
        scope.submissionData.copresenterTwo.email = "franklin17@morris.umn.edu";
        scope.submissionData.adviserInfo.email = "jane875@morris.umn.edu";
        scope.submissionData.coadviserOneInfo.email = "johnx117@morris.umn.edu";
        scope.submissionData.coadviserTwoInfo.email = "svenx994@morris.umn.edu";

        expect(scope.checkEmailsAreMorris()).toEqual(false);
    });

    it('Should return false since there is a different edu email.', function() {
        scope.submissionData.presenterInfo.email = "billy557@wisconsin.edu";
        scope.submissionData.copresenterOne.email = "george@morris.umn.edu";
        scope.submissionData.copresenterTwo.email = "franklin17@morris.umn.edu";
        scope.submissionData.adviserInfo.email = "jane875@morris.umn.edu";
        scope.submissionData.coadviserOneInfo.email = "johnx117@morris.umn.edu";
        scope.submissionData.coadviserTwoInfo.email = "svenx994@morris.umn.edu";

        expect(scope.checkEmailsAreMorris()).toEqual(false);
    });

    it('Should return false since there is a different gov email.', function() {
        scope.submissionData.presenterInfo.email = "billy557@morris.umn.edu";
        scope.submissionData.copresenterOne.email = "george@morris.umn.edu";
        scope.submissionData.copresenterTwo.email = "franklin17@morris.umn.edu";
        scope.submissionData.adviserInfo.email = "jane875@morris.umn.edu";
        scope.submissionData.coadviserOneInfo.email = "johnx117@army.gov";
        scope.submissionData.coadviserTwoInfo.email = "svenx994@morris.umn.edu";

        expect(scope.checkEmailsAreMorris()).toEqual(false);
    });

});
