'use strict';

angular.module('umm3601ursamajorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('groupChange', {
        url: '/groupChange',
        templateUrl: 'app/groupChange/groupChange.html',
        controller: 'GroupChangeCtrl'
      });
  });