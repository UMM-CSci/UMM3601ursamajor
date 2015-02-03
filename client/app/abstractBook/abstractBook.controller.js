'use strict';

angular.module('umm3601ursamajorApp')
  .controller('AbstractbookCtrl', function ($scope, $http, socket, $modal, Modal, Auth, $window, $filter, $location) {

        //When we tested this function, it worked correctly with only two
        //parameters given, until we checked the final else case, in which
        // case it broke with only two parameters
        angular.module('umm3601ursamajorApp')
            .filter('isntEmpty', function(){
                return function(input, title, altTitle){
                    if(typeof(input) == "object"){
                        if(input.length > 0){
                            return title + " " + input;
                        }
                    } else if (input !== "" && input !== null){
                        return title + " " + input;
                    } else {
                        return altTitle;
                    }
                }
            });

                $scope.submissions = [];
                $scope.status = [];

                $scope.getCurrentUser = Auth.getCurrentUser;
                $scope.group = Auth.getCurrentUser().group;
                $scope.email = Auth.getCurrentUser().email;
                $scope.isReviewer = Auth.isReviewer;
                $scope.isAdmin = Auth.isAdmin;
                $scope.isChair = Auth.isChair;

        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            socket.syncUpdates('submission', $scope.submissions);
            console.log('loaded submissions');
        });

        $http.get('/api/statuss').success(function(status) {
            $scope.status = status;
//            $scope.statusGet();
            socket.syncUpdates('status', $scope.status);
        });

        $scope.isAccepted = function(submission){
            return submission.status.priority === 15;
        };
  });
