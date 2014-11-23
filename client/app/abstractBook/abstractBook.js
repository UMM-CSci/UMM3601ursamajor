'use strict';

angular.module('umm3601ursamajorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('abstractBook', {
        url: '/abstractBook',
        templateUrl: 'app/abstractBook/abstractBook.html',
        controller: 'AbstractbookCtrl'
      });
  });