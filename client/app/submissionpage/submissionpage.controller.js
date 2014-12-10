'use strict';

angular.module('umm3601ursamajorApp')
  .controller('SubmissionpageCtrl', function ($scope, Auth, $location) {

        // Re-directs if you aren't logged in.
        if(Auth.isLoggedIn() === false) {
            $location.path('/');
        }

        $scope.isLoggedIn = Auth.isLoggedIn;

  });
