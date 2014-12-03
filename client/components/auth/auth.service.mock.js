'use strict';

angular.module('authMock', [])
    .factory('Auth', function () {
        var currentUser = {};

        return {
            setCurrentUser: function(email, role, group) {
                currentUser = {
                    email: email,
                    role: role,
                    group: group
                }
            },

            getCurrentUser: function() {
                return currentUser;
            },

            isLoggedIn: function() {
                return currentUser.hasOwnProperty('role');
            },

            isAdmin: function() {
                return currentUser.role === 'admin';
            },

            isChair: function() {
                return currentUser.role === 'chair';
            }
        }
    });