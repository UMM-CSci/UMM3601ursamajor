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

  beforeEach(function(){
    scope.submissionsAll = [
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
          Major: [{name: "reviewer", email: "reviewer@reviewer.com"}],
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
          Major: [],
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
          Accepted: [{name: "reviewer1", email: "reviewer1@reviewer.com"},{name: "reviewer2", email: "reviewer2@reviewer.com"},{name: "reviewer3", email: "reviewer3@reviewer.com"},{name: "reviewer4", email: "reviewer4@reviewer.com"}],
          Minor: [],
          Major: [],
          TotalRewrite: []
        }
      }
    ]

    scope.submissionsPrimary = [
      {
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
          Major: [{name: "reviewer", email: "reviewer@reviewer.com"}],
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
          Major: [],
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
          Accepted: [{name: "reviewer1", email: "reviewer1@reviewer.com"},{name: "reviewer2", email: "reviewer2@reviewer.com"},{name: "reviewer3", email: "reviewer3@reviewer.com"},{name: "reviewer4", email: "reviewer4@reviewer.com"}],
          Minor: [],
          Major: [],
          TotalRewrite: []
        }
      }
    ]
  });

  it('should ...', function () {
    expect(1).toEqual(1);
  });

  it('getPrimarySubmissions on submissionsAll should return submissionsPrimary', function () {
    scope.submissions = [];
    scope.getPrimarySubmissions(scope.submissionsAll);
    expect(scope.submissions).toEqual(scope.submissionsPrimary);
  });

  it('getPrimarySubmissions on submissionsPrimary should return submissionsPrimary', function () {
    scope.submissions = [];
    scope.getPrimarySubmissions(scope.submissionsPrimary);
    expect(scope.submissions).toEqual(scope.submissionsPrimary);
  });

  it('getPrimarySubmissions on emptySubmissions should return emptySubmissions', function () {
    scope.submissions = [];
    scope.emptySubmissions = [];
    scope.getPrimarySubmissions(scope.emptySubmissions);
    expect(scope.submissions).toEqual(scope.emptySubmissions);
  });

  it('hasCoadviser should return true when submission has coadviser one or two', function () {
    expect(scope.hasCoadviser(scope.submissionsAll[0])).toEqual(true);
  });

  it('hasCoadviser should return false when submission does not have a coadviser one or two', function () {
    expect(scope.hasCoadviser(scope.submissionsAll[3])).toEqual(false);
  });

  it('reviewGroupSelectionIsEmpty should return false if it is not equal to "" ', function () {
    scope.selection = {reviewGroup: "Hello"};
    expect(scope.reviewGroupSelectionIsEmpty()).toEqual(false);
  });

  it('reviewGroupSelectionIsEmpty should return true if it is equal to "" ', function () {
    scope.selection = {reviewGroup: ""};
    expect(scope.reviewGroupSelectionIsEmpty()).toEqual(true);
  });

  describe('Functions controlling filtering...', function(){
    beforeEach(function(){
      scope.filterSelection;
      scope.selection = {reviewGroup: ""};
    });

    it('filterByGroup should return true if All is selected regardless of submissions group', function () {
      scope.filterSelection = 'All';
      expect(scope.filterByGroup(scope.submissionsAll[0])).toEqual(true);
      expect(scope.filterByGroup(scope.submissionsAll[1])).toEqual(true);
      expect(scope.filterByGroup(scope.submissionsAll[2])).toEqual(true);
      expect(scope.filterByGroup(scope.submissionsAll[3])).toEqual(true);
    });

    it('filterByGroup should return false if group number of submission isnt 0 when filterSelection is', function () {
      scope.filterSelection = 0;
      expect(scope.filterByGroup(scope.submissionsAll[0])).toEqual(false);
    });

    it('filterByGroup should return true if group number of submission is 1 when filterSelection is', function () {
      scope.filterSelection = 1;
      expect(scope.filterByGroup(scope.submissionsAll[0])).toEqual(false);
      expect(scope.filterByGroup(scope.submissionsAll[1])).toEqual(true);
    });

    it('filterByGroup should return true if group number of submission is 2 when filterSelection is', function () {
      scope.filterSelection = 2;
      expect(scope.filterByGroup(scope.submissionsAll[1])).toEqual(false);
      expect(scope.filterByGroup(scope.submissionsAll[3])).toEqual(true);
    });

    it('filterByGroup should return true if group number of submission is 3 when filterSelection is', function () {
      scope.filterSelection = 3;
      expect(scope.filterByGroup(scope.submissionsAll[0])).toEqual(true);
      expect(scope.filterByGroup(scope.submissionsAll[3])).toEqual(false);
    });

    it('filterByGroup should return true if group number of submission is 4 when filterSelection is', function () {
      scope.filterSelection = 4;
      expect(scope.filterByGroup(scope.submissionsAll[0])).toEqual(false);
    });

    it('filterOutSameGroup should return true if All is selected regardless of submissions group', function () {
      scope.selection.reviewGroup = '';
      expect(scope.filterOutSameGroup(scope.submissionsAll[0])).toEqual(true);
      expect(scope.filterOutSameGroup(scope.submissionsAll[1])).toEqual(true);
      expect(scope.filterOutSameGroup(scope.submissionsAll[2])).toEqual(true);
      expect(scope.filterOutSameGroup(scope.submissionsAll[3])).toEqual(true);
    });

    it('filterOutSameGroup should return true if group number of submission isnt 0 when filterSelection is', function () {
      scope.selection.reviewGroup = 0;
      expect(scope.filterOutSameGroup(scope.submissionsAll[0])).toEqual(true);
    });

    it('filterOutSameGroup should return false if group number of submission is 1 when filterSelection is', function () {
      scope.selection.reviewGroup = 1;
      expect(scope.filterOutSameGroup(scope.submissionsAll[0])).toEqual(true);
      expect(scope.filterOutSameGroup(scope.submissionsAll[1])).toEqual(false);
    });

    it('filterOutSameGroup should return false if group number of submission is 2 when filterSelection is', function () {
      scope.selection.reviewGroup = 2;
      expect(scope.filterOutSameGroup(scope.submissionsAll[1])).toEqual(true);
      expect(scope.filterOutSameGroup(scope.submissionsAll[3])).toEqual(false);
    });

    it('filterOutSameGroup should return false if group number of submission is 3 when filterSelection is', function () {
      scope.selection.reviewGroup = 3;
      expect(scope.filterOutSameGroup(scope.submissionsAll[0])).toEqual(false);
      expect(scope.filterOutSameGroup(scope.submissionsAll[3])).toEqual(true);
    });

    it('filterOutSameGroup should return false if group number of submission is 4 when filterSelection is', function () {
      scope.selection.reviewGroup = 4;
      expect(scope.filterOutSameGroup(scope.submissionsAll[0])).toEqual(true);
    });
  });

});
