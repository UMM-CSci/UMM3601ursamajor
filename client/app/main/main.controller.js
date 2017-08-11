'use strict';

angular.module('umm3601ursamajorApp')
  .controller('MainCtrl', function ($scope, $http, Auth, socket) {

    $scope.isCollapsed = true;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentEmail = Auth.email;

    $scope.hasUMNEmail = function(){
      return Auth.getCurrentUser().email.indexOf("umn.edu") != -1;
    };

    // An array of possible tShirtSize's.
    $scope.tShirtSizeOptions =
      [ "Small",
        "Medium",
        "Large",
        "XLarge",
        "XXLarge",
        "XXXLarge"
      ];

    // Changes the tShirtSize designated to a user.
    $scope.updateTShirtSize = function(){
      Auth.updateTShirtSize($scope.user.tShirtSize);
      Auth.getCurrentUser().tShirtSize = $scope.user.tShirtSize;
    };

    $scope.pickTShirtSize = function(){
      if(Auth.getCurrentUser().tShirtSize == ""){
        return true;
      }
      else{
        return false;
      }

    }

    // Get the modal
    var modal = document.getElementById('tShirtModal');

    // Opens modal if user has not picked a t-shirt size yet
    $scope.openModal = function() {
      modal.style.display = "block";

    }



  });
