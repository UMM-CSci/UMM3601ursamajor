'use strict';

angular.module('umm3601ursamajorApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
        updateInfo: {
            method: 'PUT',
            params: {
            }
        },
        updateTShirtSize: {
            method: 'PUT',
                params: {
            }
        },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
