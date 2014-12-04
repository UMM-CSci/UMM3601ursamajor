
'use strict';

angular.module('umm3601ursamajorApp')
    .controller('RoleChangeCtrl', function ($scope, $http, Auth, User, $location, $filter, socket) {
        if(Auth.isAdmin() || Auth.isChair()) {
        } else{
            $location.path('/');
        }

        // Use the User $resource to fetch all users
        $scope.users = User.query();
        $scope.isAdmin = Auth.isAdmin;
        $scope.isChair = Auth.isChair();
//
//    $scope.submissions = [];
//
//    $http.get('/api/submissions').success(function(submissions) {
//        $scope.submissions = submissions;
//    });

        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            socket.syncUpdates('submission', $scope.submissions);
        });

        $scope.roleOptions =
            [   'chair',
                'reviewer',
                'admin',
                'user'
            ];
        $scope.groupOptions =
            [   1,
                2,
                3,
                4
            ];

        $scope.userIsAdmin = function(user){
            return user.role === "admin";
        };
        $scope.userIsReviewer = function(user){
            return user.role === "reviewer";
        };
        $scope.userIsUser = function(user){
            return user.role === "user";
        };


        $scope.deleteUser = function(user) {
            if (Auth.getCurrentUser().email === user.email){
                alert('Cannot delete yourself.');
            }
            else if(confirm('Are you sure you want to delete this user?')) {
                User.remove({ id: user._id });
                angular.forEach($scope.users, function(u, i) {
                    if (u === user) {
                        $scope.users.splice(i, 1);
                    }
                });
            }
        };

        $scope.checkForConflict = function(user) {
            if (
                $filter('filter')($scope.submissions,
                    function(submission) {
                        if(submission == null) return false;
                        return user.group === submission.group || user.email === submission.presenterInfo.email || user.email === submission.adviserInfo.email;
                    }
                ).length > 0
                ) {
                alert('Conflict with user and role.');
            }
        };

        $scope.updateInfo = function(user) {
            console.log(user);
            $scope.checkForConflict(user);
            if (Auth.getCurrentUser().email === user.email){
                alert('Cannot change user role for yourself.');
            }
            else if(confirm('Are you sure you want to update this users role?')) {
                if(user.role != 'reviewer') {
                    Auth.updateInfo(user.role, -1, user);
                } else {
                    Auth.updateInfo(user.role, user.group, user);
                }
            }
        };

        $scope.changeGroup = function(user) {
            console.log(user.group, user.role);
            if(confirm('Are you sure you want to update this users Jacob Opdahl group?')) {
                Auth.changeGroup(user.group, user);
            }
            console.log(user.group, user.role)
        };
    });