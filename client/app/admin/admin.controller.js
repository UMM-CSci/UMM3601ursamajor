'use strict';

angular.module('umm3601ursamajorApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User, $location, socket) {

        $scope.submissions = [];
        $scope.users = [];

        $scope.getSubmissionData = function(){
            $http.get('/api/submissions').success(function(submissions){
                $scope.submissions = submissions;
                socket.syncUpdates('submission', $scope.submissions);
            });
        };

        $scope.getSubmissionData();

        $http.get('/api/users').success(function(users){
            $scope.users = users;
        });

       $scope.totalSubmissions = function(){
           return $scope.submissions.length;
       };

       $scope.totalUsers = function(){
           return $scope.users.length;
       };

        $scope.toggles = {
            subListToggle: false,
            statsToggle: false
        };

        $scope.resetToggles = function(){
            for(var key in $scope.toggles) {
                if($scope.toggles.hasOwnProperty(key)){
                    $scope.toggles[key] = false;
                }
            }
        };

        $scope.toggleSubList = function(){
            $scope.resetToggles();
            $scope.toggles.subListToggle = true;
        };

        $scope.toggleStats = function(){
            $scope.resetToggles();
            $scope.toggles.statsToggle = true
        };

    });
