'use strict';

angular.module('umm3601ursamajorApp')
    .controller('AccountinfoCtrl', function ($scope, Auth, $location) {
        if(Auth.isLoggedIn() === false) {
            $location.path('/');
        }

        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.getCurrentEmail = Auth.email;
        $scope.isReviewer = Auth.isReviewer;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getReviewerGroup = Auth.getReviewerGroup;

        $scope.isAdmin = Auth.isAdmin;
    });