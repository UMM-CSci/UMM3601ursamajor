'use strict';

angular.module('umm3601ursamajorApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User, $location, socket, $filter) {

        //this is for the admin menu buttons.
        $('li').click(function(){
            $('li').removeClass('selected');
            $(this).addClass('selected');
        });

        $scope.submissions = [];
        $scope.currentYearSubmissions = [];
        $scope.users = [];
        $scope.isAdmin = Auth.isAdmin;

        //--------------------------- Getting Data from Mongo --------------------------

        $scope.getSubmissionData = function(){
            $http.get('/api/submissions').success(function(submissions){
                $scope.submissions = submissions;
                $scope.createCurrentYearSubmissions();
                socket.syncUpdates('submission', $scope.submissions);
            });
        };

        $scope.getSubmissionData();

        $http.get('/api/users').success(function(users){
            $scope.users = users;
        });

        //-------------------------- Stats view functions -------------------------------
       $scope.trackedSubmissions = function(submissions){
          return $filter('filter')(submissions, function(sub){return sub.resubmissionData.isPrimary}).length;
       };

       $scope.totalSubmissions = function(submissions){
           return submissions.length;
       };

       $scope.precentageTracked = function(submissions){
           return Math.round(($scope.trackedSubmissions(submissions) / $scope.totalSubmissions(submissions)) * 100);
       };

       $scope.totalUsers = function(){
           return $scope.users.length;
       };

      $scope.totalAdmins = function() {
        return $filter('filter')($scope.users, function(user){return user.role === "admin"}).length
      };

      $scope.totalChairs = function() {
        return $filter('filter')($scope.users, function(user){return user.role === "chair"}).length
      };

      $scope.totalReviewers = function(group) {
        return $filter('filter')($scope.users, function(user){return user.role === "reviewer" && user.group == group}).length
      };

      $scope.totalBasicUsers = function() {
        return $filter('filter')($scope.users, function(user){return user.role === "user"}).length
      };

      $scope.resubmitFlags = function(submissions){
          return $filter('filter')(submissions, function(sub){return sub.resubmissionData.resubmitFlag}).length
      };

      $scope.createCurrentYearSubmissions = function(){
          for(var i = 0; i < $scope.submissions.length; i++){
              if($scope.currentYearFilter($scope.submissions[i])){
                  $scope.currentYearSubmissions.push($scope.submissions[i]);
              }
          }
      };

      //For filtering submissions with current year
      $scope.currentYearFilter = function(submission){
        var date = new Date();
        var year = date.getFullYear();
        return submission.timestamp.indexOf(year) != -1;
      };

      //For gathering all of the t0shirt info.
      $scope.totalShirts = function(size) {
        return $filter('filter')($scope.users, function(user){return user.tShirtSize == size}).length
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
