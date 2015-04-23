'use strict';

describe('Controller: AbstractbookCtrl', function () {
    beforeEach(module('umm3601ursamajorApp'));
    beforeEach(module('socketMock'));
    describe('isntEmpty', function() {
        it('should return return the title and item ' +
                'if the item is an object with length over 0, not ' +
                'an object, but not "" or null, else altTitle',
            inject(function(isntEmptyFilter) {
                expect(isntEmptyFilter("item1", "First Item", "something else")).toBe("First Item item1");
                expect(isntEmptyFilter(21, "myNumber", "something else")).toBe("myNumber 21");
                expect(isntEmptyFilter(["happy", "days", "testing", "rocks"], "arrays", "something else")).toBe('arrays happy,days,testing,rocks');
                expect(isntEmptyFilter("", "something else", "this was an empty string")).toBe("this was an empty string");
            }));
    });

    var AbstractbookCtrl, scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        AbstractbookCtrl = $controller('AbstractbookCtrl', {
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
                coadviserOneInfo: {first: "Dalton", last: "Gusaas", email: "gusaa004@morris.umn.edu"},
                coadviserTwoInfo: {},
                featured: false,
                mediaServicesEquipment: "",
                specialRequirements: "a sloth",
                presenterTeeSize: "M",
                otherInfo: "Maybe",
                approval: false,
                status: {strict: "Accepted", text: "Your adviser has yet to approve this submission.", priority: 15},
                timestamp: "Mon Jul 20 2014 1:48:54 GMT-0500 (CDT)",
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
                approval: false,
                rejection: false,
                status: {strict: "Revisions Needed", text: "Your URS submission has been flagged for revisions, and is in need of changes.", priority: 11},
                timestamp: "Tue Oct 21 2015 23:22:54 GMT-0500 (CDT)",
                group: 1,
                resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
                comments:[]
            }
        ];

      scope.submissions[1].timestamp = Date();

    });


    it('1 should equal 1...', function () {
        expect(1).toEqual(1);
    });

    describe('returns true if a submission is accepted', function() {
       it('something', inject(function(){
           expect(scope.isAccepted(scope.submissions[0])).toEqual(true);
           expect(scope.isAccepted(scope.submissions[1])).toEqual(false);
        }));

        it('currentYearFilter should filter out non 2015 submissions', function () {
          expect(scope.currentYearFilter(scope.submissions[0])).toEqual(false);
          expect(scope.currentYearFilter(scope.submissions[1])).toEqual(true);
        });
    });

});
