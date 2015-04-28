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

        if(!Auth.isAdmin() && !Auth.isChair()) {
            $location.path('/');
        }

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
            //console.log('loaded submissions');
        });

        $http.get('/api/statuss').success(function(status) {
            $scope.status = status;
//            $scope.statusGet();
            socket.syncUpdates('status', $scope.status);
        });

        //For filtering submissions with current year
        $scope.currentYearFilter = function(submission){
          var currentDate = new Date();
          var currentYear = currentDate.getFullYear();
          var prevYear = currentYear - 1;
          var subDate = new Date(submission.timestamp);

          if (currentDate.getMonth() <= 6) {   // If it is Spring Semester (6 is July).
            if (subDate.getFullYear() == currentYear) { // We care about any spring semester submissions from the current year.
              return true;
            } else if ((subDate.getFullYear() == prevYear) && (subDate.getMonth() > 6)) { // We also care about submissions from last fall.
              return true;
            } else {
              return false;
            }
          } else {   // Else it is Fall Semester.
            return ((subDate.getFullYear() == currentYear) && (subDate.getMonth() > 6)); // In the fall, we only care about this year's submissions from fall.
          }
        };

        $scope.isAccepted = function(submission){
            return submission.status.priority === 15;
        };




  });
