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
        $scope.timeFrame = "current";

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

        //determine acceptance status
        $scope.isAccepted = function(submission){
            return submission.status.priority === 15;
        };

        //classifier functions for past/present abstracts
        $scope.setCurrent = function(){
          $scope.timeFrame = 'current';
        };

        $scope.setPast = function(){
          $scope.timeFrame = 'past';
        };

        //sub-function to determine which abstracts to display depending on tab chosen
        $scope.checkTime = function(sub) {
          //if ($scope.timeFrame === 'current' && $scope.isAccepted(sub)) {
          //display all current submissions for now due to testing
          if ($scope.timeFrame === 'current') {
            return $scope.currentYearFilter(sub);
          } else if ($scope.timeFrame === 'past' && $scope.isAccepted(sub)){
            return !$scope.currentYearFilter(sub);
          }
        };

        //in-progress function to insert presentation type headers
        //$scope.divideByType = function(submissions) {
        //  if (submissions[$scope.index + 1].presentationType !== submissions[$scope.index].presentationType) {
        //    return submissions[$scope.index +1].presentationType;
        //  }
        //};

        $scope.downloadAbstract = function (elemId, mimeType) {
            //generates a text file containing all abstracts on the active page
            //output is a basic text file, nor formatting at the moment

            var elemText = document.getElementById(elemId).innerText;
            var link = document.createElement('a');
            mimeType = mimeType || 'text/plain';

            link.setAttribute('download', 'abstract.txt');
            link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elemText));
            link.click();

            //possible word doc generator packages:
            //jsPDF
            //officeGen
            //html-docx-js
        };
  });
