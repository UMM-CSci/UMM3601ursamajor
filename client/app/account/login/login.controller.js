'use strict';

angular.module('umm3601ursamajorApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {

    //TODO: this is really broken right now we have no idea why. We'll fix it later (tm) (11/22/14)
    // But sometimes it works. Still don't know why.
    if((Auth.isLoggedIn())) {
        console.log("Made it in the if-statement" + Auth.isLoggedIn());
        $location.path('/');
    }

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
