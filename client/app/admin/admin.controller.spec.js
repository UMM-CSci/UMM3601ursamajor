'use strict';

describe('Controller for Admin Page...', function() {
    beforeEach(module('umm3601ursamajorApp'));
    beforeEach(module('socketMock'));
    beforeEach(module('authMock'));

    var AdminCtrl, scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        AdminCtrl = $controller('AdminCtrl', {
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
                sponsors: [], //Might need to worry about if this is static for the DB later.
                adviserInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
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
                comments: []
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
                sponsors: [],
                adviserInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
                featured: true,
                mediaServicesEquipment: "",
                specialRequirements: "A space to perform with three people.",
                presenterTeeSize: "M",
                otherInfo: "",
                approval: true,
                status: {strict: "Revisions Needed", text: "Your URS submission has been flagged for revisions, and is in need of changes."},
                timestamp: "Tue Oct 21 2014 23:22:54 GMT-0500 (CDT)",
                group: 1,
                resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
                comments:[]
            }
        ];

        scope.users = [
            {email: "admin@admin.com", role: "admin", group: 1},
            {email: "user_0@user.com", role: "chair", group: 3},
            {email: "user_1@user.com", role: "user", group: 2}
        ]
    });

    it('1 should equal 1...', function () {
        expect(1).toEqual(1);
    });

//----------------------- Trying to test data in mongo --------------//

    describe('system info functions...', function() {
        it('Total # of tracked submissions', function() {
          expect(scope.trackedSubmissions()).toEqual(1);
        });

        it('Total # of submissions in system should be accurate', function() {
           expect(scope.totalSubmissions()).toEqual(2);
        });

       it('Total percentage of tracked submissions', function() {
          expect(scope.precentageTracked()).toEqual(50);
        });

        it('Total # of registered users should be accurate', function() {
            expect(scope.totalUsers()).toEqual(3);
        });

        it('Total # of resubmitflags', function() {
          expect(scope.resubmitFlags()).toEqual(0);
        });

        it('Total # of resubmitflags', function() {
          expect(scope.unapprovedResubmits()).toEqual(1);
        });
    });

  //----------------------------- Nav Control ---------------------------//

  describe('functions affecting the view...', function() {
        it('default view should be statistics view', function(){
          expect(scope.toggles.statsToggle).toEqual(true);
          expect(scope.toggles.subFormEditorToggle).toEqual(false);
          expect(scope.toggles.userEditToggle).toEqual(false);
          expect(scope.toggles.statusEditToggle).toEqual(false);
          expect(scope.toggles.abstractBookToggle).toEqual(false);
          expect(scope.toggles.subListToggle).toEqual(false);

        });

        it('resetToggles should reset the view completely', function(){
            scope.resetToggles();
            for(var key in scope.toggles){
                if (scope.toggles.hasOwnProperty(key)){
                    expect(scope.toggles[key]).toEqual(false);
                }
            }
        });

/*        it('toggling sublist', function() {
            scope.toggles.subListToggle();
            scope.resetToggles();
            expect(scope.toggles.subListToggle).toEqual(true);
        });*/

    });


    //TODO: Apparently testing things based on $location is a bit complicated. Someone should look into it.
//    it("should redirect non admins to the home page", inject( function(Auth, $location){
//        Auth.setCurrentUser("user_1@user.com", "user", 1);
//        $location.path('/admin');
//        expect($location.path()).toEqual('/');
//    }));
//
//    it("should allow admins to view the page", inject(function(Auth, $location){
//        Auth.setCurrentUser("admin@admin.com", "admin", 3);
//        $location.path('/admin');
//        expect($location.path()).toEqual('/admin');
//    }));

});
