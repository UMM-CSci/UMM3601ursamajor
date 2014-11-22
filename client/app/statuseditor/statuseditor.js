'use strict';

angular.module('umm3601ursamajorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('statuseditor', {
        url: '/statuseditor',
        templateUrl: 'app/statuseditor/statuseditor.html',
        controller: 'StatuseditorCtrl'
      });
  });