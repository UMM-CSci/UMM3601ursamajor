/**
 * Created by opdah023 on 10/9/14.
 */
'use strict';
 //When we tested this function, it worked correctly with only two
 //parameters given, until we checked the final else case, in which
 // case it broke with only two parameters
angular.module('umm3601ursamajorApp')
    .filter('isntEmpty', function(){
        return function(input, title, altTitle){
            if(typeof(input) == "object"){
                if(input.length > 0){
                    return title + " " + input;
                }
            } else if (input !== "" && input !== null){
                return title + " " + input;
            } else {
                return altTitle;
            }
        }
    })

    .filter('fancyLimitTo', function(){
        return function(input, limit){
            return input.substring(0, limit) + "[...]";
        }
    })

    .controller('SublistCtrl', function ($scope, $http, socket, $modal, Modal, Auth, $window, $filter) {
        $scope.submissions = [];
        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.group = Auth.getCurrentUser().group;
        $scope.email = Auth.getCurrentUser().email;
        $scope.isReviewer = Auth.isReviewer;
        $scope.isAdmin = Auth.isAdmin;

        //--------------------- Filter Functions -----------------------

        $scope.filterData = {
            searchText: "",
            reviewGroupFilterSelection: "All",
            reviewGroupFilterOptions: [
                "All",
                "Unassigned",
                "Review Group 1",
                "Review Group 2",
                "Review Group 3",
                "Review Group 4"
            ]
        };

        $scope.setReviewGroupSelection = function(str) {
            $scope.filterData.reviewGroupFilterSelection = str;
        };

        $scope.hasAdminPrivs = function(submission){
            return (($scope.getCurrentUser.role != null && $scope.getCurrentUser.role == "Admin") || $scope.isAdmin());
        };

        $scope.isPresenter = function(submission) {
            if(submission == null) return false;
            return $scope.email === submission.presenterInfo.email;
        };

        $scope.isCoPresenter = function(submission) {
            if(submission == null) return false;
            return $scope.email === submission.copresenterOneInfo.email ||
                $scope.email === submission.copresenterTwoInfo.email;
        };

        $scope.isAdviser = function(submission) {
            if(submission == null) return false;
            return $scope.email === submission.adviserInfo.email;
        };

        $scope.isReviewerGroup = function(submission){
            if(submission == null) return false;
            return $scope.group === submission.group;
        };

        $scope.hasPermissions = function(submission) {
            if(submission == null) return false;
            if(!Auth.isLoggedIn){
                console.log("Not logged in!");
                return false;
            }

            if($scope.hasAdminPrivs()){
                return true;
            } else {
                console.log("Not admin, is logged in");
                return $scope.isPresenter(submission) ||
                       $scope.isCoPresenter(submission) ||
                       $scope.isAdviser(submission) ||
                       $scope.isReviewerGroup(submission)
            }
        };

        $scope.reviewGroupFilter = function(submission) {
            if($scope.filterData.reviewGroupFilterSelection === "All"){
                return true;
            } else if($scope.filterData.reviewGroupFilterSelection === "Unassigned"){
                return submission.group == 0;
            } else if($scope.filterData.reviewGroupFilterSelection === "Review Group 1"){
                return submission.group == 1;
            } else if($scope.filterData.reviewGroupFilterSelection === "Review Group 2"){
                return submission.group == 2;
            } else if($scope.filterData.reviewGroupFilterSelection === "Review Group 3"){
                return submission.group == 3;
            } else if($scope.filterData.reviewGroupFilterSelection === "Review Group 4"){
                return submission.group == 4;
            } else {
                return false;
            }
        };

        $scope.searchFilter = function(submission){
            var searchText = $scope.filterData.searchText.toLowerCase();
            return(
                (submission.presenterInfo.first.toLowerCase().indexOf(searchText) != -1) ||
                (submission.presenterInfo.last.toLowerCase().indexOf(searchText) != -1) ||
                (submission.copresenterOneInfo.first.toLowerCase().indexOf(searchText) != -1) ||
                (submission.copresenterOneInfo.last.toLowerCase().indexOf(searchText) != -1) ||
                (submission.copresenterTwoInfo.first.toLowerCase().indexOf(searchText) != -1) ||
                (submission.copresenterTwoInfo.last.toLowerCase().indexOf(searchText) != -1) ||
                (submission.adviserInfo.first.toLowerCase().indexOf(searchText) != -1) ||
                (submission.adviserInfo.last.toLowerCase().indexOf(searchText) != -1)
            )
        };

        // ----------------------- Getting Data from Mongo ----------------------------

        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            socket.syncUpdates('submission', $scope.submissions);
        });

//        $http.get('/api/status').success(function(status) {
//            $scope.status = status;
//            socket.syncUpdates('status', $scope.status);
//        });


        var sendGmail = function(opts){
            var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
                '&to=' + opts.to +
                '&su=' + opts.subject +
                '&body=' + opts.message +
                '&ui=1';
            $window.open(str);
        };

        //----------------------------- Color Coding of submission list -----------------------------

        $scope.statusColorTab = function(status){
            switch(status){
                case "Awaiting Adviser Approval":
                    return {'border-left': '4px solid rgba(200, 30, 0, 1)'};
                    break;
                case "Reviewing in Process":
                    return {'border-left': '4px solid rgba(225, 225, 10, 1)'};
                    break;
                case "Revisions Needed":
                    return {'border-left': '4px solid rgba(20, 138, 255, 1)'};
                    break;
                case "Accepted":
                    return {'border-left': '4px solid rgba(71, 214, 0, 1)'};
                    break;
            }
        };

        $scope.statusColorBody = function(status){
            switch(status){
                case "Awaiting Adviser Approval":
                    return {'background-color': 'rgba(200, 30, 0, 1)'};
                    break;
                case "Reviewing in Process":
                    return {'background-color': 'rgba(225, 225, 10, 1)'};
                    break;
                case "Revisions Needed":
                    return {'background-color': 'rgba(20, 138, 255, 1)'};
                    break;
                case "Accepted":
                    return {'background-color': 'rgba(71, 214, 0, 1)'};
                    break;
            }
        };

        // ---------------------- Controlling selection of submission for detail view ---------------------------------

        $scope.selection = {selected: false, item: null};

        $scope.selectItem = function(itemIndex){
            console.log("setting index " + itemIndex + " as active item");
            $scope.selection.selected = true;
            $scope.selection.item = $filter('filter')(
                $filter('filter')(
                    $filter('filter')($scope.submissions, $scope.hasPermissions), $scope.reviewGroupFilter),
                $scope.searchFilter)[itemIndex];

            $scope.resetTemps();
        };

        $scope.resetSelection = function(){
            $scope.selection.selected = false;
            $scope.resetTemps();
        };

        $scope.deleteSubmissionConfirm = function(item){
            Modal.confirm.delete($scope.deleteSubmission)(item.title, item);
        };

        $scope.deleteSubmission = function(item){
            console.log("Deleting submission: " + item.title);
            $http.delete('/api/submissions/' + item._id);
            $scope.resetSelection();
        };

        // -------------------------- Editing of status ----------------------------------------------
        $scope.statusEdit = {
            editing: false,
            options: ["Reviewing in Process",
                "Revisions Needed",
                "Accepted"],
            subject:"URS submission update",
            body:[ ", your URS submission has been approved by your adviser.",
                  ", your URS submission has been flagged for revisions, and is in need of changes.",
                ", your URS submission has been approved, congratulations!"],
            temp: {strict: "", text: ""}
        };

        //Not working code, scrapped to use on a later date
        //     -Nic (11/9)
//        $scope.getColor = function(strict) {
//            for(var i = 0; i < status.length; i++){
//                if($scope.status[i].strict === strict){
//                    return $scope.status[i].color;
//                }
//            }
//        };

        $scope.resetTemps = function() {
            if($scope.selection.item != null){
                $scope.statusEdit.temp.strict = $scope.selection.item.status.strict;
                $scope.statusEdit.temp.text = $scope.selection.item.status.text;
            }
        };

        $scope.resetTemps();

        $scope.editStatus = function(){
            $scope.statusEdit.editing = !$scope.statusEdit.editing;
            $scope.resetTemps();
        };

        $scope.submitStatusEdit = function(){
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {status: {strict: $scope.statusEdit.temp.strict, text: $scope.statusEdit.temp.text}}
            ).success(function(){
                    console.log("Successfully updated status of submission");
            });



            if($scope.selection.item.approval && $scope.statusEdit.temp.strict === "Awaiting Adviser Approval"){
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {approval: false}
                ).success(function(){
                    $scope.selection.item.approval = false;
                    console.log("Successfully updated approval of submission (un-approved)");
                });
            } else if(!$scope.selection.item.approval && $scope.statusEdit.temp.strict !== "Awaiting Adviser Approval"){
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {approval: true}
                ).success(function(){
                    $scope.selection.item.approval = true;
                    console.log("Successfully updated approval of submission (approved)");
                });
            }

            $scope.selection.item.status.strict = $scope.statusEdit.temp.strict;
            $scope.selection.item.status.text = $scope.statusEdit.temp.text;

        //--------------------------------------------- gmail stuff? ---------------------------------------

            sendGmail({
                to: $scope.selection.item.presenterInfo.email,
                subject: $scope.statusEdit.subject,
                message: $scope.selection.item.presenterInfo.first +
                    $scope.statusEdit.body[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)]
            });
            $scope.resetTemps();
            $scope.editStatus();
        };

        

        $scope.approvalWordChange = function(approval){
             if(approval){
                 return "Yes";
                 }
             else{
                 return "No";
                 }
             };


        //--------------------------------------------- Tabs Stuff ---------------------------------------



    });