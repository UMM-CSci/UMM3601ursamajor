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
    $scope.isCoChair = Auth.isCoChair;
    $scope.getCurrentUser = Auth.getCurrentUser;
    //$scope.group = Auth.getCurrentUser.group;

//    $scope.loggedIn = function(){
//        if(Auth.email.indexOf("@morris") >= 0){
//            return true;
//        }
//        return false;
//    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });