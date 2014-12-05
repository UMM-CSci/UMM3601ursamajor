'use strict';

angular.module('umm3601ursamajorApp')
    .controller('StatuseditorCtrl', function ($scope, $http, Auth, $location, User, Modal, socket) {
        if(Auth.isAdmin() || Auth.isChair()) {
        } else {
            $location.path('/');
        }
        $scope.users = User.query();
        $scope.isAdmin = Auth.isAdmin;
        $scope.isChair = Auth.isChair;
        $scope.statusArray = [];
        $scope.submissions = [];
        $scope.statusColors = [
            {red: 255, green: 255, blue: 255, alpha: 0},
            {red: 194, green: 194, blue: 194, alpha: 1},
            {red: 120, green: 120, blue: 120, alpha: 1},
            {red: 255, green: 0, blue: 0, alpha: 0},
            {red: 255, green: 128, blue: 0, alpha: 1},
            {red: 255, green: 255, blue: 0, alpha: 1},
            {red: 202, green: 255, blue: 37, alpha: 1},
            {red: 0, green: 255, blue: 0, alpha: 1},
            {red: 0, green: 255, blue: 255, alpha: 1},
            {red: 47, green: 118, blue: 255, alpha: 1},
            {red: 128, green: 0, blue: 255, alpha: 1},
            {red: 255, green: 0, blue: 255, alpha: 1}

        ]

        $scope.showColorSlider = false;

        $http.get('/api/statuss').success(function(statusArray) {
            $scope.statusArray = statusArray;
            $scope.statusArray.sort(function(a, b){return b.priority- a.priority});
        });

        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            socket.syncUpdates('submission', $scope.submissions);
        });

        $scope.getStatuses = function(){
            $http.get('/api/statuss').success(function(statusArray) {
                $scope.statusArray = statusArray;
                $scope.statusArray.sort(function(a, b){return b.priority- a.priority});
            });
        };

        $scope.statusEditorColor = function(status){
            return {'border-left': '4px solid rgb(' + status.color.red   + ','
                + status.color.green + ','
                + status.color.blue  + ')'};
        };

        $scope.statusBoxColor = function(color){
            return {'background-color': 'rgb(' + color.red   + ','
                + color.green + ','
                + color.blue  + ')'};
        };

        $scope.colorClick = function(item, color) {
            item.color = color;
        };

        $scope.deleteStatusConfirm = function(item){
            Modal.confirm.delete($scope.deleteStatus)(item.strict, item);
        };

        $scope.deleteStatus = function(item){
            $http.delete('/api/statuss/' + item._id).success(function () {
                $scope.statusArray.splice($scope.statusArray.indexOf(item), 1);
            });
            var threshold = item.priority;
            for (var j = 0; j < $scope.statusArray.length; j++) {
                if ($scope.statusArray[j].priority != 15 && $scope.statusArray[j].priority != -15) {
                    if ($scope.statusArray[j].priority > threshold) {
                        $scope.statusArray[j].priority--;
                        $http.patch('/api/statuss/' + $scope.statusArray[j]._id,
                            {priority: $scope.statusArray[j].priority})
                    }
                }
            }
        };



        $scope.findEmptyPriority = function(status){
            var count = 2;
            for(var j = 0; j < status.length; j++) {
                for (var i = 0; i < status.length; i++) {
                    if (status[i].priority == count) {
                        count++;
                    }
                }
            }
            return count;
        };

        $scope.testYes = function(){
            console.log("yes");
        }
        $scope.testNo = function(){
            console.log("No");
        }


        $scope.testConfirm = function(){
            Modal.confirm.option($scope.testYes,$scope.testNo)("Did the test work?");
        };


        $scope.addStatusConfirm = function(){
            Modal.confirm.info($scope.addStatus)("Create a new status?");
        };

        $scope.addStatus = function() {
            $http.post('/api/statuss/',
                {   strict: "Default Status",
                    color: {red: 0, green: 0, blue: 0, alpha: 1},
                    emailSubject: "",
                    emailBody: "",
                    priority: $scope.findEmptyPriority($scope.statusArray),
                    required: false
                }).success(function () {
                    console.log("Successfully added new status")
                    $scope.getStatuses();
                });
        };


        $scope.requiredStatus = function(status){
            return(status.required);
        };


        $scope.submitChangesConfirm = function(status){
            Modal.confirm.info($scope.submitChanges(status))("Save changes made to this status?");
        };

        $scope.submitChanges = function(status) {
            var strict = "";
            var problem = false;
            var x = $scope.statusArray.indexOf(status);
            for (var i = 0; i < $scope.statusArray.length; i++) {
                if ($scope.statusArray[i].priority == status.priority) {
                    if ($scope.statusArray[i]._id != status._id) {
                        problem = true;
                    }

                }
                if ((status.priority <= 1 || status.priority >= 14)) {
                    problem = true;

                }
                if(status.required) {
                    problem = false;
                }

            }
            if (!problem) {
                $http.get('/api/statuss/' + $scope.statusArray[x]._id).success(function (oldStatus) {
                    strict = oldStatus.strict;

                    $http.patch('/api/statuss/' + $scope.statusArray[x]._id,
                        {
                            strict: $scope.statusArray[x].strict,
                            color: $scope.statusArray[x].color,
                            emailSubject: $scope.statusArray[x].emailSubject,
                            emailBody: $scope.statusArray[x].emailBody,
                            priority: $scope.statusArray[x].priority
                        }
                    ).success(function () {
                            $location.path('/admin');
                            for (var j = 0; j < $scope.submissions.length; j++) {
                                if ($scope.submissions[j].status.strict == strict) {
                                    console.log("things were detected to be different");
                                    $scope.submissions[j].status.strict = $scope.statusArray[x].strict;
                                    $http.patch('/api/submissions/' + $scope.submissions[j]._id, {
                                        status: {strict: $scope.statusArray[x].strict, text: $scope.submissions[j].status.text}
                                    })

                                }
                            }
                        })
                })


            } else {
                Modal.confirm.warning()("There is a problem using this priority (priority is less than 2, greater than 14, or shares a priority with another status). Please, pick a new one.");
            }
        }

    });
