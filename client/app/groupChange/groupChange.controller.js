'use strict';

angular.module('umm3601ursamajorApp')
  .controller('GroupChangeCtrl', function ($scope, Auth, $location, $http, socket, Modal, $filter) {

    $scope.allSubmissions = [];
    $scope.submissions = [];
    $scope.users = [];

    // Empty is just for starting the drop-down with empty.
    $scope.reviewGroupOptions =
      [ "",
        0,
        1,
        2,
        3,
        4
      ];

    $scope.filterGroupOptions =
      [ 'All',
        0,
        1,
        2,
        3,
        4
      ];

    $scope.filterSelection = 'All';

    // Assigned empty string at first so no option is displayed.
    $scope.selection = {reviewGroup: ""};

    // RE-direct if not an admin or chair.
    if(!Auth.isAdmin() && !Auth.isChair()) {
      $location.path('/');
    }

    // Get submissions and put primary into submissions array.
    $http.get('/api/submissions').success(function(submissions) {
      $scope.allSubmissions = submissions;
      socket.syncUpdates('submission', $scope.allSubmissions);
      $scope.getPrimarySubmissions($scope.allSubmissions);
    });

    // Gets users for purposes of finding conflicts between submission people and reviewers.
    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });

    // Gets only submissions that are primary. That is, it removes submissions
    // that have had resubmissions approved.
    $scope.getPrimarySubmissions = function(submissions) {
      for (var i = 0; i < submissions.length; i++) {
        if (submissions[i].resubmissionData.isPrimary) {
          $scope.submissions.push(submissions[i])
        }
      }
    };

    // Filter so that the user can specify a review group to see submissions for.
    $scope.filterByGroup = function(submission) {
      if ($scope.filterSelection === 'All') {
        return true;
      } else if ($scope.filterSelection == 0) {
        return submission.group == 0;
      } else if ($scope.filterSelection == 1) {
        return submission.group == 1;
      } else if ($scope.filterSelection == 2) {
        return submission.group == 2;
      } else if ($scope.filterSelection == 3) {
        return submission.group == 3;
      } else if ($scope.filterSelection == 4) {
        return submission.group == 4;
      }
    };

    // Filter to remove submissions that are in the review group that is going to be assigned to.
    $scope.filterOutSameGroup = function(submission) {
      if ($scope.selection.reviewGroup === "") {
        return true;
      } else if ($scope.selection.reviewGroup == 0) {
        return submission.group != 0;
      } else if ($scope.selection.reviewGroup == 1) {
        return submission.group != 1;
      } else if ($scope.selection.reviewGroup == 2) {
        return submission.group != 2;
      } else if ($scope.selection.reviewGroup == 3) {
        return submission.group != 3;
      } else if ($scope.selection.reviewGroup == 4) {
        return submission.group != 4;
      }
    };

    // Simple function to hide submit button if the review group selection is "".
    $scope.reviewGroupSelectionIsEmpty = function() {
      return $scope.selection.reviewGroup === "";
    };

    // ======= THE NEXT FOUR FUNCTIONS ARE ALL APART OF SUBMITTING A REVIEW GROUP CHANGE ======

    $scope.getReviewGroupMembers = function(group) {
      return $filter('filter')($scope.users,
        function(user) {
          return user.group == group;
        })
    };

    $scope.checkForConflict = function(submission) {
      //console.log("checking for conflicts for: " + submission.title + " and review group " + $scope.selection.reviewGroup);
      if (
        $filter('filter')($scope.getReviewGroupMembers($scope.selection.reviewGroup),
          function(user) {
            return user.email === submission.copresenterOneInfo.email || user.email === submission.presenterInfo.email || user.email === submission.adviserInfo.email || user.email === submission.copresenterTwoInfo.email || user.email === submission.coadviserOneInfo.email || user.email === submission.coadviserTwoInfo.email;
          }
        ).length > 0
      ) {
        //console.log("Conflict with submission and review group.");
        Modal.confirm.warning()('There is a conflict with the submission and review group. ' +
                                'You are attempting to assign this submission to a review group ' +
                                'while one of the reviewers is either a (co)presenter or (co)adviser for this submission. ' +
                                'This change is allowed, but cautioned.');
      }
    };

    $scope.setReviewGroupConfirm = function(submission) {
      //$scope.selection.reviewGroup = submission.group;
      Modal.confirm.info($scope.setReviewGroup)('Are you sure you want to change the review group for this submission to ' + $scope.selection.reviewGroup + '?', submission);
    };

    $scope.setReviewGroup = function(submission) {
      $scope.checkForConflict(submission);
      $http.patch('api/submissions/' + submission._id,
        {group: $scope.selection.reviewGroup}
      ).success( function(){
          console.log("Successfully updated status of submission");
          submission.group = $scope.selection.reviewGroup;
        });
    };
  });
