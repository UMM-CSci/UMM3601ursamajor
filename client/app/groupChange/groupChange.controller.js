'use strict';

angular.module('umm3601ursamajorApp')
  .controller('GroupChangeCtrl', function ($scope, Auth, $location, $http, socket, Modal, $filter) {

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
      $scope.submissions = submissions;
      socket.syncUpdates('submission', $scope.submissions);
    });

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });

    $scope.getReviewGroupMembers = function(group) {
      return $filter('filter')($scope.users,
        function(user) {
          return user.group == group;
        })
    };

    // Todo: Update to include coadvisers...
    $scope.checkForConflict = function(submission) {
      console.log("checking for conflicts for: " + submission.title + " and review group " + $scope.selection.reviewGroup);
      if (
        $filter('filter')($scope.getReviewGroupMembers($scope.selection.reviewGroup),
          function(user) {
            return user.email === submission.copresenterOneInfo.email || user.email === submission.presenterInfo.email || user.email === submission.adviserInfo.email || user.email === submission.copresenterTwoInfo.email;
          }
        ).length > 0
      ) {
        console.log("Conflict with submission and review group.");
        Modal.confirm.warning()('Conflict with submission and review group.');
      }
    };

    $scope.setReviewGroupConfirm = function(submission) {
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
