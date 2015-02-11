/**
* Created by saxxx027 on 11/10/14.
*/

'use strict';

describe('filter', function() {
    beforeEach(module('umm3601ursamajorApp'));

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


    describe('fancyLimitTo', function() {
        it('should return first "n" characters of the imputed text',
            inject(function(fancyLimitToFilter){
                expect(fancyLimitToFilter("abc", 1 )).toBe("a[...]");
                expect(fancyLimitToFilter("12345", 0)).toBe("[...]");
                expect(fancyLimitToFilter("", 5)).toBe("[...]");
            }));
    });

});

describe('filterSelections', function() {
  beforeEach(module('umm3601ursamajorApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('authMock'));

  var SublistCtrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    SublistCtrl = $controller('SublistCtrl', {
      $scope: scope
    });
  }));

  beforeEach(function() {
    scope.filterData = {
      searchText: "",
      orderByPredicate: "",
      reviewGroupFilterSelection: "All",
      reviewGroupFilterOptions: [
        "All",
        "Unassigned",
        "Review Group 1",
        "Review Group 2",
        "Review Group 3",
        "Review Group 4"
      ],
      tabFilter: {isPresenter:false, isCoPresenter:false, isReviewer:false, isAdviser:false},
      featurePresentationFilterSelection: "All",
      featurePresentationFilterOptions: [
        "All",
        "Wants to be featured",
        "No desire to be featured"
      ],
      flaggedForResubmitFilterSelection: "All",
      flaggedForResubmitFilterOptions: [
        "All",
        "Flagged",
        "Not Flagged"
      ],
      pendingResubmissionsSelection: "All",
      pendingResubmissionsOptions: [
        "All",
        "Pending Resubmissions",
        "Not Pending Resubmissions"
      ]
    };
  });

  describe('Function that sets the string for filtering based on review group.', function() {
    it('Should change the scope.reviewGroupFilterSelection from All to Review Group 1', function() {
      expect(scope.filterData.reviewGroupFilterSelection).toEqual(scope.filterData.reviewGroupFilterOptions[0]);
      scope.setReviewGroupSelection(scope.filterData.reviewGroupFilterOptions[2]);
      expect(scope.filterData.reviewGroupFilterSelection).toEqual(scope.filterData.reviewGroupFilterOptions[2]);
    });

    it('Should change the scope.reviewGroupFilterSelection from All to unassigned to Review group 3.', function() {
      expect(scope.filterData.reviewGroupFilterSelection).toEqual(scope.filterData.reviewGroupFilterOptions[0]);
      scope.setReviewGroupSelection(scope.filterData.reviewGroupFilterOptions[1]);
      expect(scope.filterData.reviewGroupFilterSelection).toEqual(scope.filterData.reviewGroupFilterOptions[1]);
      scope.setReviewGroupSelection(scope.filterData.reviewGroupFilterOptions[4]);
      expect(scope.filterData.reviewGroupFilterSelection).toEqual(scope.filterData.reviewGroupFilterOptions[4]);
    });
  });

  describe('Function that sets the string for filtering based on feature presentation.', function() {
    it('Should change the scope.featurePresentationFilterSelection from All to Wants to be featured', function() {
      expect(scope.filterData.featurePresentationFilterSelection).toEqual(scope.filterData.featurePresentationFilterOptions[0]);
      scope.setFeaturePresentationFilterSelection(scope.filterData.featurePresentationFilterOptions[1]);
      expect(scope.filterData.featurePresentationFilterSelection).toEqual(scope.filterData.featurePresentationFilterOptions[1]);
    });

    it('Should change the scope.featurePresentationFilterSelection from All to No desire to be featured, back to all.', function() {
      expect(scope.filterData.featurePresentationFilterSelection).toEqual(scope.filterData.featurePresentationFilterOptions[0]);
      scope.setFeaturePresentationFilterSelection(scope.filterData.featurePresentationFilterOptions[2]);
      expect(scope.filterData.featurePresentationFilterSelection).toEqual(scope.filterData.featurePresentationFilterOptions[2]);
      scope.setFeaturePresentationFilterSelection(scope.filterData.featurePresentationFilterOptions[0]);
      expect(scope.filterData.featurePresentationFilterSelection).toEqual(scope.filterData.featurePresentationFilterOptions[0]);
    });
  });

  describe('Function that sets the string for filtering based on flagged for resubmission.', function() {
    it('Should change the scope.flaggedForResubmitFilterSelection from All to Wants to Not Flagged', function() {
      expect(scope.filterData.flaggedForResubmitFilterSelection).toEqual(scope.filterData.flaggedForResubmitFilterOptions[0]);
      scope.setFlaggedForResubmitFilterSelection(scope.filterData.flaggedForResubmitFilterOptions[2]);
      expect(scope.filterData.flaggedForResubmitFilterSelection).toEqual(scope.filterData.flaggedForResubmitFilterOptions[2]);
    });

    it('Should change the scope.flaggedForResubmitFilterSelection from All to No desire to Flagged, to Not Flagged.', function() {
      expect(scope.filterData.flaggedForResubmitFilterSelection).toEqual(scope.filterData.flaggedForResubmitFilterOptions[0]);
      scope.setFlaggedForResubmitFilterSelection(scope.filterData.flaggedForResubmitFilterOptions[1]);
      expect(scope.filterData.flaggedForResubmitFilterSelection).toEqual(scope.filterData.flaggedForResubmitFilterOptions[1]);
      scope.setFlaggedForResubmitFilterSelection(scope.filterData.flaggedForResubmitFilterOptions[2]);
      expect(scope.filterData.flaggedForResubmitFilterSelection).toEqual(scope.filterData.flaggedForResubmitFilterOptions[2]);
    });
  });

  describe('Function that sets the string for filtering based on pending resubmission.', function() {
    it('Should change the scope.pendingResubmissionsSelection from All to All', function() {
      expect(scope.filterData.pendingResubmissionsSelection).toEqual(scope.filterData.pendingResubmissionsOptions[0]);
      scope.setPendingResubmissionsSelection(scope.filterData.pendingResubmissionsOptions[0]);
      expect(scope.filterData.pendingResubmissionsSelection).toEqual(scope.filterData.pendingResubmissionsOptions[0]);
    });

    it('Should change the scope.pendingResubmissionsSelection from All to Pending Resubmissions to Not Pending Resubmissions', function() {
      expect(scope.filterData.pendingResubmissionsSelection).toEqual(scope.filterData.pendingResubmissionsOptions[0]);
      scope.setPendingResubmissionsSelection(scope.filterData.pendingResubmissionsOptions[1]);
      expect(scope.filterData.pendingResubmissionsSelection).toEqual(scope.filterData.pendingResubmissionsOptions[1]);
      scope.setPendingResubmissionsSelection(scope.filterData.pendingResubmissionsOptions[2]);
      expect(scope.filterData.pendingResubmissionsSelection).toEqual(scope.filterData.pendingResubmissionsOptions[2]);
    });
  });

});

describe('Functions dealing with submissions...', function() {
    beforeEach(module('umm3601ursamajorApp'));
    beforeEach(module('socketMock'));
    beforeEach(module('authMock'));

    var SublistCtrl, scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        SublistCtrl = $controller('SublistCtrl', {
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
            approval: true,
            cc: false,
            rejection: false,
            status: {strict: "Awaiting Adviser Approval", priority: -15, text: "Your adviser has yet to approve this submission."},
            timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
            group: 3,
            resubmissionData: {comment: "Initial Submission", parentSubmission: "testIdForTesting", isPrimary: false, resubmitFlag: false},
            comments: [],
            reviewVotes: {
                Accepted: [],
                Minor: [],
                Major: [],
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
           sponsors: [],
           adviserInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
           coadviserOneInfo: {},
           coadviserTwoInfo: {},
           featured: true,
           mediaServicesEquipment: "",
           specialRequirements: "A space to perform with three people.",
           presenterTeeSize: "M",
           otherInfo: "",
           approval: false,
           cc: false,
           rejection: false,
           status: {strict: "Revisions Needed", priority: 3, text: "Your URS submission has been flagged for revisions, and is in need of changes."},
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
        }, {
               _id: "veryUniqueID2",
               title: "The Commemoration and Memorialization of the American Revolution",
               format: "Artist Statement",
               abstract: "This project involves discovering how the American Revolution was remembered during the nineteenth century.  " +
                   "The goal is to show that the American Revolution was memorialized by the actions of the United States government during the 1800s. " +
                   "This has been done by examining events such as the Supreme Court cases of John Marshall and the Nullification Crisis. " +
                   "Upon examination of these events, it becomes clear that John Marshall and John Calhoun (creator of the Doctrine of Nullification) " +
                   "attempted to use the American Revolution to bolster their claims by citing speeches from Founding Fathers. " +
                   "Through showing that the American Revolution lives on in memory, " +
                   "this research highlights the importance of the revolution in shaping the actions of the United States government.",
               presentationType: "Performance",
               formatChange: false,
               presenterInfo: {first: "Mitchell", last: "Finzel", email: "finze008@morris.umn.edu"},
               copresenterOneInfo: {first: "Brandon", last: "Moody", email: "moody107@morris.umn.edu"},
               copresenterTwoInfo: {first: "", last: "", email: ""},
               discipline: "History",
               sponsors: [], //Might need to worry about if this is static for the DB later.
               adviserInfo: {first: "Emma", last: "Sax", email: "saxxx027@morris.umn.edu"},
               coadviserOneInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
               coadviserTwoInfo: {first: "", last: "", email: ""},
               featured: true,
               mediaServicesEquipment: "A way to show images, either a projector or a warning so I can print them.",
               specialRequirements: "",
               otherInfo: "yes.",
               approval: true,
               cc: false,
               rejection: false,
               status: {strict: "Reviewing in Process", priority: 2, text: "Your URS submission has been approved by your adviser"},
               timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
               group: 3,
               roomAssignment: "Science 2610",
               resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
               comments: [],
               reviewVotes: {
                   Accepted: [],
                   Minor: [],
                   Major: ["reviewer@reviewer.com"],
                   TotalRewrite: []
               }
           }, {
               _id: "veryUniqueID3",
               title: "Margaret C. Anderson’s Little Review",
               format: "Social Science",
               abstract: "This research looks at the work of Margaret C. Anderson, the editor of the Little Review.  " +
                   "The review published first works by Sherwood Anderson, James Joyce, Wyndham Lewis, and Ezra Pound.  " +
                   "This research draws upon mostly primary sources including memoirs, published letters, and a complete collection of the Little Review. " +
                   "Most prior research on Anderson focsal033@morris.umn.eduuses on her connection to the famous writers and personalities that she published and associated with.  " +
                   "This focus undermines her role as the dominant creative force behind one of the most influential little magazines published in the 20th Century. " +
                   "This case example shows how little magazine publishing is arguably a literary art.",
               presentationType: "Poster or Visual Display",
               formatChange: true,
               presenterInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
               copresenterOneInfo: {first: "", last: "", email: ""},
               copresenterTwoInfo: {first: "", last: "", email: ""},
               discipline: "English",
               sponsors: [], //Might need to worry about if this is static for the DB later.
               adviserInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
               coadviserOneInfo: {first: "", last: "", email: ""},
               coadviserTwoInfo: {first: "", last: "", email: ""},
               featured: true,
               mediaServicesEquipment: "",
               specialRequirements: "A small space to make the presentation personal.",
               otherInfo: "yes.",
               approval: true,
               cc: false,
               rejection: false,
               status: {strict: "Accepted", priority: 15, text: "Your URS submission has been approved, congratulations!"},
               timestamp: "Thur Oct 23 2014 1:48:54 GMT-0500 (CDT)",
               group: 2,
               roomAssignment: "Science 2610",
               resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: true},
               comments: [],
               reviewVotes: {
                   Accepted: [],
                   Minor: [],
                   Major: [],
                   TotalRewrite: ["reviewer@reviewer.com"]
               }
           }
       ]
    });

    it('1 should equal 1...', function () {
        expect(1).toEqual(1);
    });

    describe('Functions controlling filtering...', function(){
        // Injecting the whole filter service here might be bad practice? IDK, but it works.
        it('Default review group filter should show ALL submissions...', inject(['$filter', function($filter) {
            expect($filter('filter')(scope.submissions, scope.reviewGroupFilter).length == scope.submissions.length).toEqual(true);
        }]));

        it('User with admin role should have admin privs.', inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.hasAdminPrivs()).toEqual(true);
        });

//        it('Should return true if featured is true, return false is featured is false', inject(['$filter', function(featurePresentationFilter) {
//            var $scope.filterData.featurePresentationFilterSelection = "";
//            scope.setFeaturePresentationFilterSelection("All");
//            expect(scope.featurePresentationFilter(scope.submissions[0]).toEqual(true);
////                expect(scope.featurePresentationFilter(scope.submissions[1])).toEqual(false);
//            }]));

        it("Submission's assigned review group members should be in same review group", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 3)}), function() {
            expect(scope.isReviewerGroup(scope.submissions[0])).toEqual(true);
        });

        it("Submission not in user's review group shouldn't be in user's review group", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function(){
            expect(scope.isReviewerGroup(scope.submissions[0])).toEqual(false);
        });

        describe('Functions controlling filter tabs...', function() {
            it('No filtered tabs should be selected by default...', function() {
                for(var key in scope.filterData.tabFilter){
                    if(scope.filterData.tabFilter.hasOwnProperty(key)){
                        expect(scope.filterData.tabFilter[key]).toEqual(false);
                    }
                }
            });

            it('showMySubmissions should set the isPresenter tab to true', function() {
                scope.showMySubmissions();
                expect(scope.filterData.tabFilter.isPresenter).toEqual(true);
            });

            //TODO: more of these need to be written? Functions might need to be refactored to be more testable...
        });


    });

    describe("Functions controlling the selecting...", function() {
        it("No submission should be selected by default", function() {
            expect(scope.selection.selected).toEqual(false);
            expect(scope.selection.selected.item).toEqual(null);
            expect(scope.selection.selected.resubmission).toEqual(null);
        });

        it("selectItem() should set submission as selected", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            scope.selectItem(1);
            expect(scope.selection.selected).toEqual(true);
            expect(scope.selection.item != null).toEqual(true);
            expect(scope.selection.item._id).toBe("testIdForTesting");
        });

        it("selectItem() should find resubmission of selected submission", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            scope.selectItem(1);
            expect(scope.selection.resubmission != null).toEqual(true);
            expect(scope.selection.resubmission._id).toBe("uniqueIdString");
        });

        it("Selecting when filters are applied should select the correct submission (review group filter)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
           expect(scope.selection.item).toEqual(null);
           scope.filterData.reviewGroupFilterSelection = "Review Group 1";
           scope.selectItem(0);
           expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select correct submission (tab filters)", inject(function(Auth){Auth.setCurrentUser("opdah023@morris.umn.edu", "admin", 1)}), function() {
           expect(scope.selection.item).toEqual(null);
           scope.filterData.tabFilter.isPresenter = true;
           scope.selectItem(0);
           expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select the correct submission (feature presentation)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.selection.item).toEqual(null);
            scope.filterData.featurePresentationFilterSelection = "Wants to be featured";
            scope.selectItem(0);
            expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select the correct submission (flagged for resubmission)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.selection.item).toEqual(null);
            scope.filterData.flaggedForResubmitFilterSelection = "Not Flagged";
            scope.selectItem(0);
            expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select the correct submission (pending resubmissions)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.selection.item).toEqual(null);
            scope.filterData.pendingResubmissionsOptions = "Not Pending Resubmissions";
            scope.selectItem(0);
            expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });



    });

    describe('Functions handling resubmissions...', function() {
        it('Should be a resubmission... ', function() {
            expect(scope.isResubmission(scope.submissions[0])).toEqual(true);
        });

        it('Should find the resubmission of a submission', function() {
            expect(scope.getResubmission(scope.submissions[1]) != null).toEqual(true);
            expect(scope.getResubmission(scope.submissions[1])._id).toBe("uniqueIdString");
        });

        describe('Testing logic for displaying resubmit button...', function(){
            describe('Should show correct buttons for admin...', function() {
                beforeEach(inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}));

                it('When submission has no flag and no resubmissions', function(){
                    scope.selectItem(2);
                    expect(scope.showResubmitButton().show).toEqual(true);
                    expect(scope.showResubmitButton().text).toBe("Flag for Re-Submission");
                    expect(scope.showResubmitButton().style).toBe("btn-primary");
                });

                it('When submission is flagged', function(){
                    scope.selectItem(3);
                    expect(scope.showResubmitButton().show).toEqual(true);
                    expect(scope.showResubmitButton().text).toBe("Remove Resubmit Flag");
                    expect(scope.showResubmitButton().style).toBe("btn-warning");
                })
            });

            describe('Should show correct buttons for presenter...', function(){
                beforeEach(inject(function(Auth){Auth.setCurrentUser("finze008@morris.umn.edu", "user", 1)}));

                it('When the submission has no flag and no resubmissions', function(){
                    scope.selectItem(2);
                    expect(scope.showResubmitButton().show).toEqual(true);
                    expect(scope.showResubmitButton().text).toBe("Re-Submit this Submission");
                    expect(scope.showResubmitButton().style).toBe("btn-primary");
                });

                it('When the submission is flagged', function(){
                    scope.submissions[2].resubmissionData.resubmitFlag = true;
                    scope.selectItem(2);
                    expect(scope.showResubmitButton().show).toEqual(true);
                    expect(scope.showResubmitButton().text).toBe("Click to Resubmit");
                    expect(scope.showResubmitButton().style).toBe("btn-primary");
                });

                it('When the submission is not approved', function(){
                    scope.submissions[2].approval = false;
                    scope.selectItem(2);
                    expect(scope.showResubmitButton().show).toEqual(false);
                });
            });
        });
    });

    describe('Functions handling approve/reject button...', function() {
        it('should be approved...', function () {
            expect(scope.submissions[0].approval).toEqual(true);
        });

        it('should not be rejected...', function (){
            expect(scope.submissions[1].rejection).toEqual(false);
        });

//        it('should be a rejection...', function (){
//           scope.rejectSubmission(scope.submissions);
//           expect(scope.submissions[1].rejection).toEqual(true);
//        });

    });

    describe('Testing the that the additional advisers are indeed in a submission...', function() {
        it('coadviserOneInfo for submission 1 [0] should be Dalton Gusaas...', function() {
            expect(scope.submissions[0].coadviserOneInfo).toEqual({ first : 'Dalton', last : 'Gusaas', email : 'gusaa004@morris.umn.edu'});
        });

        it('coadviserTwoInfo for submission 1 [0] should be blank...', function() {
            expect(scope.submissions[0].coadviserTwoInfo).toEqual({});
        });

        it('both coadvisers should be blank for submission 2 [1]...', function(){
           expect(scope.submissions[1].coadviserOneInfo && scope.submissions[1].coadviserTwoInfo).toEqual({});
        });

    });

    describe('Testing voting by looking for certain statuses...', function() {
        it('Major for submission 2 [1] should be reviewer@reviewer.com...', function() {
            expect(scope.submissions[1].reviewVotes.Major.length).toEqual(1);
        });

        it('Accepted for submission 1 [0] should be blank...', function() {
            expect(scope.submissions[0].reviewVotes.Accepted.length).toEqual(0);
        });

    });

    describe('Testing for statuses in submissions...', function() {
        it('Status for submission 1 [0] should be "Awaiting Adviser Approval"...', function() {
            expect(scope.submissions[0].status).toEqual({strict: 'Awaiting Adviser Approval', priority: -15, text: 'Your adviser has yet to approve this submission.'});
        });

        it('Status for submission 2 [1] should be "Awaiting Adviser Approval"...', function() {
            expect(scope.submissions[1].status).toEqual({strict: 'Revisions Needed', priority: 3, text: 'Your URS submission has been flagged for revisions, and is in need of changes.'});
        });

    });

    describe('Function that verifies a submission is not in progress and still needs adviser approval (statusApprovalConflict)', function() {
        it('Should return false if the submission argument is null.', function() {
            expect(scope.statusApprovalConflict(null)).toEqual(false);
        });

        it('Should return true if the submission argument has false for adviser approval and priority is not -15', function() {
           expect(scope.statusApprovalConflict(scope.submissions[1])).toEqual(true);
        });

        it('Should return false if the submission argument has true for adviser approval and priority is -15', function() {
          expect(scope.statusApprovalConflict(scope.submissions[2])).toEqual(false);
        });
    });
});
