
'use strict';

angular.module('umm3601ursamajorApp')
    .controller('RoleChangeCtrl', function ($scope, Modal, $http, Auth, User, $location, $filter, socket) {
        if(Auth.isAdmin() || Auth.isChair()) {
        } else {
            $location.path('/');
        }

        // Use the User $resource to fetch all users
        $scope.users = User.query();
        $scope.isAdmin = Auth.isAdmin;
        $scope.isChair = Auth.isChair();

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

        // Functions return true if current user is of a specific type, false otherwise.
        $scope.userIsAdmin = function(user){
            return user.role === "admin";
        };
        $scope.userIsReviewer = function(user){
            return user.role === "reviewer";
        };
        $scope.userIsUser = function(user){
            return user.role === "user";
        };


        $scope.filterByUser = function(user){
            if(user === "All"){
                return true;
            } else if(user === "reviewer"){
                return true;
            } else if(user === "chair"){
                return true;
            } else if(user === "user"){
                return true;
            } else if(user === "admin"){
                return true;
            } else {
                return false;
            }
        }

        //Delete user modal
        $scope.deleteUserConfirm = function(user){
            if (Auth.getCurrentUser().email === user.email){
                Modal.confirm.warning()("Cannot delete yourself.");
            } else {
                Modal.confirm.delete($scope.deleteUser)(user.name);
            }
        };

        // Deletes a user.
        $scope.deleteUser = function(user) {
            User.remove({ id: user._id });
            angular.forEach($scope.users, function(u, i) {
                if (u === user) {
                    $scope.users.splice(i, 1);
                }
            });
        };

        // Checks if there is a conflict between the user and the group they are being assigned to.
          // Currently not working, have too many stories to worry about this right now.
        $scope.checkForConflict = function(user) {
            if (
                $filter('filter')($scope.submissions,
                    function(submission) {
                        if(submission == null) return false;
                        return user.group === submission.group ||
                            user.email === submission.presenterInfo.email || user.email === submission.adviserInfo.email;
                    }
                ).length > 0
                ) {
                alert('Conflict with user and role.');
            }
        };


        $scope.updateInfoConfirm = function(user) {
            Modal.confirm.info($scope.updateInfoConfirm)("Save changes made to " + user.name + "?");
        };

        // Updates a users role as long as the user being changed isn't the one doing the changing.
        $scope.updateInfo = function(user) {
            console.log(user);
            //$scope.checkForConflict(user);
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
    });