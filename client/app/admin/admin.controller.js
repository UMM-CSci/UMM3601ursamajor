'use strict';

angular.module('umm3601ursamajorApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User, $location, socket, $filter) {

        //this is for the admin menu buttons.
        $('li').click(function(){
            $('li').removeClass('selected');
            $(this).addClass('selected');
        });

        $scope.submissions = [];
        $scope.users = [];
        $scope.isAdmin = Auth.isAdmin;

        //--------------------------- Getting Data from Mongo --------------------------

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

        //-------------------------- Stats view functions -------------------------------
       $scope.trackedSubmissions = function(){
          return $filter('filter')($scope.submissions, function(sub){return sub.resubmissionData.isPrimary}).length;
       };

       $scope.totalSubmissions = function(){
           return $scope.submissions.length;
       };

       $scope.precentageTracked = function(){
           return Math.round(($scope.trackedSubmissions() / $scope.totalSubmissions()) * 100);
       };

       $scope.totalUsers = function(){
           return $scope.users.length;
       };

      $scope.resubmitFlags = function(){
          return $filter('filter')($scope.submissions, function(sub){return sub.resubmissionData.resubmitFlag}).length
      };

      $scope.unapprovedResubmits = function(){
          return $filter('filter')($scope.submissions, function(sub){return !sub.resubmissionData.isPrimary}).length;
      };

      //---------------------------- Admin Nav Control ----------------------------------

        $scope.toggles = {
            subListToggle: false,
            statsToggle: true,
            subFormEditorToggle: false,
            userEditToggle: false,
            statusEditToggle: false,
            abstractBookToggle: false,
            groupChangeToggle: false,
            roomChangeToggle: false

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
            $scope.toggles.statsToggle = true;
        };

        $scope.toggleSubEditor = function(){
            $scope.resetToggles();
            $scope.toggles.subFormEditorToggle = true;
        };

        $scope.toggleUserEdit = function(){
            $scope.resetToggles();
            $scope.toggles.userEditToggle = true;
        };

        $scope.toggleStatusEdit = function(){
            $scope.resetToggles();
            $scope.toggles.statusEditToggle = true;
        };

        $scope.toggleAbstractBook = function(){
            $scope.resetToggles();
            $scope.toggles.abstractBookToggle = true;
        };

        $scope.toggleGroupChange = function(){
          $scope.resetToggles();
          $scope.toggles.groupChangeToggle = true;
        };

        $scope.toggleRoomChange = function(){
          $scope.resetToggles();
          $scope.toggles.roomChangeToggle = true;
        };


    });
