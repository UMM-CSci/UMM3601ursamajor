'use strict';

angular.module('umm3601ursamajorApp')
  .controller('GroupChangeCtrl', function ($scope, Auth, $location, $http, socket, Modal, $filter) {

    $scope.allSubmissions = [];
    $scope.submissions = [];
    $scope.users = [];

    $scope.reviewGroupOptions =
      [ 0,
        1,
        2,
        3,
        4
      ];

    $scope.selection = {reviewGroup: 0};

    if(!Auth.isAdmin() && !Auth.isChair()) {
      $location.path('/');
    }

    $http.get('/api/submissions').success(function(submissions) {
      $scope.allSubmissions = submissions;
      socket.syncUpdates('submission', $scope.allSubmissions);
      $scope.getPrimarySubmissions($scope.allSubmissions);
    });

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

    $scope.getReviewGroupMembers = function(group) {
      return $filter('filter')($scope.users,
        function(user) {
          return user.group == group;
        })
    };

    // Todo: Update to include coadvisers...
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
      $scope.selection.reviewGroup = submission.group;
      Modal.confirm.info($scope.setReviewGroup)('Are you sure you want to change this submissions review group?', submission);
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
