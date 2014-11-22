'use strict';

angular.module('umm3601ursamajorApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
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
        document.location.href = "https://www.google.com/accounts/Logout";
        Auth.logout();
        $location.path('/login');

    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });