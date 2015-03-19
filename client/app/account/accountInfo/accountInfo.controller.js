'use strict';

angular.module('umm3601ursamajorApp')
    .controller('AccountinfoCtrl', function ($scope, Auth, $location, User) {

        // Doesn't let anyone do anything if not logged in.
        if(Auth.isLoggedIn() === false) {
            $location.path('/');
        }

        // Defines useful information.
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.getCurrentEmail = Auth.email;
        $scope.isReviewer = Auth.isReviewer;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getReviewerGroup = Auth.getReviewerGroup;

        // An array of possible tShirtSize's.
        $scope.tShirtSizeOptions =
            [   "Small",
                "Medium",
                "Large",
                "XLarge",
                "XXLarge",
                "XXXLarge"
            ];

        // Changes the tShirtSize designated to a user.
        $scope.updateTShirtSize = function(){
            Auth.updateTShirtSize($scope.user.tShirtSize);
            Auth.getCurrentUser().tShirtSize = $scope.user.tShirtSize;
        };

    });
