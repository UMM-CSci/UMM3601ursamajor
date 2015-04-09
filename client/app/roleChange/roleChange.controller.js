

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

        $scope.filterSelection = "All";

        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            socket.syncUpdates('submission', $scope.submissions);
        });


        $scope.filterRoleOptions =
            [   'All',
                'chair',
                'reviewer',
                'admin',
                'user'
            ];

        $scope.roleOptions =
            [   'chair',
                'reviewer',
                'admin',
                'user'
            ];

        // Leave 0 out despite it being the default review group.
        // Don't want to be able to assign someone to that group.
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

        // Filter so that the user can specify a user type to see users for.
        $scope.filterByUser = function(user){
            console.log("user");
            if($scope.filterSelection === "All"){
                return true;
            } else if($scope.filterSelection === "reviewer"){
                return user.role === "reviewer";
            } else if($scope.filterSelection === "chair"){
                return user.role === "chair";
            } else if($scope.filterSelection === "user"){
                return user.role === "user";
            } else if($scope.filterSelection === "admin"){
                return user.role === "admin";
            } else {
                return false;
            }
        };

        //Delete user modal
        $scope.deleteUserConfirm = function(user){
            if (Auth.getCurrentUser().email === user.email){
                Modal.confirm.warning()("Cannot delete yourself.");
            } else {
                Modal.confirm.delete($scope.deleteUser)(user.name, user);
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
/*        $scope.checkForConflict = function(user) {
            if (
                $filter('filter')($scope.submissions,
                    function(submission) {
                        if(submission == null) return false;
                        return user.group === submission.group ||
                            user.email === submission.presenterInfo.email || user.email === submission.adviserInfo.email;
                    }
                ).length > 0
                ) {
                Modal.confirm.warning()('There is a conflict with the user and the review group you are assigning them to. You are attempting to assign this user to a review group where they are either a (co)presenter or (co)adviser for a submission in that group. This change is allowed, but cautioned.');
            }
        };*/


        $scope.updateInfoConfirm = function(user) {
            if (Auth.getCurrentUser().email === user.email){
                Modal.confirm.warning()('Cannot change user role for yourself.');
            } else {
                Modal.confirm.info($scope.updateInfo)("Save changes made to " + user.name  + "?", user);
            }
        };

        // Updates a users role as long as the user being changed isn't the one doing the changing.
        $scope.updateInfo = function(user) {
            if(user.role != 'reviewer') {
                Auth.updateInfo(user.role, -1, user);
            } else {
                Auth.updateInfo(user.role, user.group, user);
            }
        };
    });
