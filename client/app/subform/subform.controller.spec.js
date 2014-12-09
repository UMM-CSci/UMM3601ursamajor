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

    beforeEach(function(){
        scope.submissions = [
            {
                _id: "uniqueIdString",
                title: "A Study of the Properties of a Paperclip in the Digestive System of a Sloth",
                format: "Artist Statement",
                abstract: "Many physicists would agree that, had it not been for scatter/gather I/O, the study of link-level acknowledgements might never have occurred. " +
                    "While such a claim might seem unexpected, it usually conflicts with the need to provide thin clients to hackers worldwide. " +
                    "In fact, few security experts would disagree with the construction of kernels. In order to overcome this question, we construct an analysis of the Ethernet (Mollah)," +
                    " which we use to prove that redundancy and replication can interfere to achieve this aim. ",
                presentationType: "Oral Presentation",
                formatChange: false,
                presenterInfo: {first: "Hongya", last: "Zhou", email: "zhoux616@morris.umn.edu"},
                copresenterOneInfo: {first: "Otto", last: "Marckel II", email: "marck018@morris.umn.edu"},
                copresenterTwoInfo: {first: "Dalton", last: "Gusaas", email: "gusaa004@morris.umn.edu"},
                discipline: "Biology",
                sponsors: ["UROP"], //Might need to worry about if this is static for the DB later.
                adviserInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
                coadviserOneInfo: {first: "Dalton", last: "Gusaas", email: "gusaa004@morris.umn.edu"},
                coadviserTwoInfo: {},
                featured: false,
                mediaServicesEquipment: "",
                specialRequirements: "a sloth",
                presenterTeeSize: "M",
                otherInfo: "Maybe",
                approval: false,
                status: {strict: "Awaiting Adviser Approval", text: "Your adviser has yet to approve this submission."},
                timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
                group: 3,
                resubmissionData: {comment: "Initial Submission", parentSubmission: "testIdForTesting", isPrimary: false, resubmitFlag: false},
                comments: [],
                reviewVotes: {
                    Accepted: [],
                    Minor: [],
                    Major: ["reviewer@reviewer.com"],
                    TotalRewrite: []
                }
            }, {
                _id: "testIdForTesting",
                title: "Blind Construction: Mixed Media",
                format: "Artist Statement",
                abstract: "The basis of this project was to create a garment using mixed media in order to mimic the human body. " +
                    "The materials we used to create this piece include: buckram, copper wire, spray paint, fabric paint, a variety of novelty fabrics, and chains.  " +
                    "The techniques we created in order to manipulate the piece include: fabric branding and burning, grid painting, sewing, draping, molding buckram, and coiling.  " +
                    "Our overall approach was to create a theatrical wearable art piece. " +
                    "Upon completion of the assignment we found the piece aesthetically pleasing because of the way it molds to the human body, but can be a piece all on its own.",
                presentationType: "Performance",
                formatChange: false,
                presenterInfo: {first: "Jacob", last: "Opdahl", email: "opdah023@morris.umn.edu"},
                copresenterOneInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
                copresenterTwoInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
                discipline: "Art History",
                sponsors: ["UROP", "MAP"],
                adviserInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
                featured: true,
                mediaServicesEquipment: "",
                specialRequirements: "A space to perform with three people.",
                presenterTeeSize: "M",
                otherInfo: "",
                approval: false,
                rejection: false,
                status: {strict: "Revisions Needed", text: "Your URS submission has been flagged for revisions, and is in need of changes."},
                timestamp: "Tue Oct 21 2014 23:22:54 GMT-0500 (CDT)",
                group: 1,
                resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
                comments:[],
                reviewVotes: {
                    Accepted: [],
                    Minor: [],
                    Major: ["reviewer@reviewer.com"],
                    TotalRewrite: []
                }
            }
        ]
    });

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

    it('Should generate a valid random index # for use in adminAutoSubmit', function() {
        var testRand = scope.randomSubmissionIndex();
        expect((testRand < scope.submissions.length) && (testRand >= 0)).toEqual(true);
    });

    it('resetData should actually reset the data', function() {
        //using small samples of data from submissionData...
        expect(scope.submissionData.title).toBe("");
        expect(scope.submissionData.formatChange).toBe(Boolean);
        expect(scope.submissionData.sponsors.length).toBe(0);
        scope.getResubmitData(scope.submissions[scope.randomSubmissionIndex()]);
        expect(scope.submissionData.title != "").toEqual(true);
        expect(scope.submissionData.formatChange || !scope.submissionData.formatChange).toEqual(true);
        expect(scope.submissionData.sponsors.length > 0).toEqual(true);
        scope.resetData();
        expect(scope.submissionData.title).toBe("");
        expect(scope.submissionData.formatChange).toBe(Boolean);
        expect(scope.submissionData.sponsors.length).toBe(0);
    });

});
