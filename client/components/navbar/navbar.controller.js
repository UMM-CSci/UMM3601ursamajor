'use strict';

angular.module('umm3601ursamajorApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $http, $filter, socket) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isChair = Auth.isChair;
    $scope.getCurrentUser = Auth.getCurrentUser;
    //$scope.group = Auth.getCurrentUser.group;

//    $scope.loggedIn = function(){
//        if(Auth.email.indexOf("@morris") >= 0){
//            return true;
//        }continue=http://www.facebook.com
//        return false;
//    };

    $scope.logout = function() {
        //document.location.href = "https://www.google.com/accounts/Logout";
        Auth.logout();
        $window.open("https://www.google.com/accounts/Logout");
        $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.submissions = [];

    $http.get('/api/submissions').success(function(submissions) {
        $scope.submissions = submissions;
        socket.syncUpdates('submission', $scope.submissions);
    });

    $scope.hasAdvisorApproval = function(submission) {
        return submission.approval;
    };

    $scope.hasAdminPrivs = function(){
        return (($scope.getCurrentUser.role != null && $scope.getCurrentUser.role == "Admin") || $scope.isAdmin() || $scope.isChair());
    };

    $scope.hasPermissions = function(submission) {
        if(submission == null) return false;
        if(!Auth.isLoggedIn){
            console.log("Not logged in!");
            return false;
        }

        if($scope.hasAdminPrivs()){
            return true;
        } else {
            return $scope.isPresenter(submission) ||
                $scope.isCoPresenter(submission) ||
                $scope.isAdviser(submission) ||
                $scope.isReviewerGroup(submission)
        }
    };

    $scope.count = function() {
        return $filter('filter')($filter('filter')($scope.submissions, $scope.hasPermissions), $scope.hasAdvisorApproval).length;
    };
  });