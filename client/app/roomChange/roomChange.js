'use strict';

angular.module('umm3601ursamajorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('roomChange', {
        url: '/roomChange',
        templateUrl: 'app/roomChange/roomChange.html',
        controller: 'RoomChangeCtrl'
      });
  });