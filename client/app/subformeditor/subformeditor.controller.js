'use strict';

angular.module('umm3601ursamajorApp')
  .controller('SubformeditorCtrl', function ($scope, $http, Auth, $location, User, Modal) {
        if(!(Auth.isAdmin() || Auth.isChair())) {
            $location.path('/');
        }

        $scope.users = User.query();
        $scope.isAdmin = Auth.isAdmin;
        $scope.isChair = Auth.isChair;
        $scope.submissionTextArray = [];
        $scope.submissionText = {};

        // Need to get what should be the only seed subformtext from the database.
        // that will be the one that is updated each time the editor is used.
        $http.get('/api/subformtexts').success(function(submissionTextArray) {
            $scope.submissionTextArray = submissionTextArray;
            $scope.submissionText = $scope.submissionTextArray[0];
        });

        $scope.submitChangesConfirm = function() {
            Modal.confirm.info($scope.submitChanges)("Are you sure you want to submit these changes to the submission form?");
        };

        $scope.submitChanges = function() {

            $http.put('/api/subformtexts/' + $scope.submissionText._id,
                {
                    title: $scope.submissionText.title,
                    adviserDisclaimer: $scope.submissionText.adviserDisclaimer,
                    ursSummary: $scope.submissionText.ursSummary,
                    notes1: $scope.submissionText.notes1,
                    nameDisclaimer: $scope.submissionText.nameDisclaimer,
                    header1: $scope.submissionText.header1,
                    criteria: $scope.submissionText.criteria,
                    header2: $scope.submissionText.header2,
                    notes2: $scope.submissionText.notes2,
                    artistCriteria: $scope.submissionText.artistCriteria,
                    humanitiesCriteria: $scope.submissionText.humanitiesCriteria,
                    scienceCriteria: $scope.submissionText.scienceCriteria,
                    notes3: $scope.submissionText.notes3,
                    submissionTitle: $scope.submissionText.submissionTitle,
                    submissionFormat: $scope.submissionText.submissionFormat,
                    submissionAbstract: $scope.submissionText.submissionAbstract,
                    submissionAbstractNotes: $scope.submissionText.submissionAbstractNotes,
                    submissionPresentationType: $scope.submissionText.submissionPresentationType,
                    submissionFormatChange: $scope.submissionText.submissionFormatChange,
                    submissionChangeNotes: $scope.submissionText.submissionChangeNotes,
                    submissionPresenter: $scope.submissionText.submissionPresenter,
                    submissionCopresenterOne: $scope.submissionText.submissionCopresenterOne,
                    submissionCopresenterTwo: $scope.submissionText.submissionCopresenterTwo,
                    submissionSponsors: $scope.submissionText.submissionSponsors,
                    submissionSponsorsNotes: $scope.submissionText.submissionSponsorsNotes,
                    submissionAdviser: $scope.submissionText.submissionAdviser,
                    submissionCoadviserOne: $scope.submissionText.submissionCoadviserOne,
                    submissionCoadviserTwo: $scope.submissionText.submissionCoadviserTwo,
                    submissionAdviserNotes: $scope.submissionText.submissionAdviserNotes,
                    submissionFeatured: $scope.submissionText.submissionFeatured,
                    submissionMediaServices: $scope.submissionText.submissionMediaServices,
                    submissionSpecialRequirements: $scope.submissionText.submissionSpecialRequirements,
                    submissionOther: $scope.submissionText.submissionOther
                }
            ).success(function () {

                    $location.path('/admin');

                });
        };

  });
