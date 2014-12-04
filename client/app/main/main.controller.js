'use strict';

angular.module('umm3601ursamajorApp')
  .controller('MainCtrl', function ($scope, $http, Auth, socket) {

    $scope.isCollapsed = true;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentEmail = Auth.email;
  });
