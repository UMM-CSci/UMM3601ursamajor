/**
 * Created by casal033 on 4/10/15.
 */
angular.module('umm3601ursamajorApp')
  .controller('LoginCheckCtrl', function ($scope, $location, Auth, $http, $filter, socket) {

    if (Auth.getCurrentUser().email.indexOf("umn.edu") == -1){
        $location.path('/');
    }



  });
