'use strict';

angular.module('umm3601ursamajorApp')
  .controller('GroupChangeCtrl', function ($scope, Auth, $location, $http, socket) {

    $scope.submissions = [];

    if(!Auth.isAdmin() && !Auth.isChair()) {
      $location.path('/');
    }

    $http.get('/api/submissions').success(function(submissions) {
      $scope.submissions = submissions;
      socket.syncUpdates('submission', $scope.submissions);
    });

    $scope.reviewGroupOptions =
      [ 0,
        1,
        2,
        3,
        4
      ];
  });
