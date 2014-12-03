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

        $scope.tShirtSizeOptions =
            [   'Small',
                'Medium',
                'Large',
                'XLarge',
                'XXLarge',
                'XXXLarge'
            ];

        $scope.updateTShirtSize = function(user){
            Auth.updateTShirtSize(user.tShirtSize, user);
//            console.log(user.tShirtSize);
//            console.log(user);
        };

    });