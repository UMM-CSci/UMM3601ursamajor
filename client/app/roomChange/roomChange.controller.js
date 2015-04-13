'use strict';

angular.module('umm3601ursamajorApp')
  .controller('RoomChangeCtrl', function ($scope, Auth, $location) {

    if(!Auth.isAdmin() && !Auth.isChair()) {
      $location.path('/');
    }
  });
