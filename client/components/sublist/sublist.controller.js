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

    .controller('SublistCtrl', function ($scope, $http, socket, $modal, Modal, Auth, $window, $filter, $location) {
        $scope.submissions = [];
        $scope.status = [];

        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.group = Auth.getCurrentUser().group;
        $scope.email = Auth.getCurrentUser().email;
        $scope.isReviewer = Auth.isReviewer;
        $scope.isAdmin = Auth.isAdmin;
        $scope.isChair = Auth.isChair;

        //--------------------- Filter Functions -----------------------

        $scope.filterData = {
            searchText: "",
            orderByPredicate: "",
            reviewGroupFilterSelection: "All",
            reviewGroupFilterOptions: [
                "All",
                "Unassigned",
                "Review Group 1",
                "Review Group 2",
                "Review Group 3",
                "Review Group 4"
            ],
            tabFilter: {isPresenter:false, isCoPresenter:false, isReviewer:false, isAdviser:false}
        };

        // Returns true when the submission HAS a parent, and ISN'T the primary.
        $scope.isResubmission = function(submission){
            return (submission.resubmissionData.parentSubmission != "" && !submission.resubmissionData.isPrimary);
        };

        //TODO: this method could easily be made more efficient? It currently checks for ANY resubmission the the entire database for EVERY submission in the database... Horrible... I'm so sorry...
        $scope.getResubmission = function(submission){
            //Perhaps we could move this into the http call...?
            var resubmits = $filter('filter')($scope.submissions, $scope.isResubmission);

            for(var x = 0; x < resubmits.length; x++){
                if(resubmits[x].resubmissionData.parentSubmission === submission._id){
                    return resubmits[x];
                }
            }
            return null;
        };

        $scope.setReviewGroupSelection = function(str) {
            $scope.filterData.reviewGroupFilterSelection = str;
        };

        $scope.hasAdminPrivs = function(){
            return (($scope.getCurrentUser.role != null && $scope.getCurrentUser.role == "Admin") || $scope.isAdmin() || $scope.isChair());
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

        $scope.isPresenterOnAnything = function(){
           return ($filter('filter')($scope.submissions, $scope.isPresenter).length > 0)
        };

        $scope.isCoPresenterOnAnything = function(){
            return ($filter('filter')($scope.submissions, $scope.isCoPresenter).length > 0)
        };

        $scope.isAdviserOfAnything = function(){
            return ($filter('filter')($scope.submissions, $scope.isAdviser).length > 0)
        };

        $scope.isReviewerOfAnything = function(){
            return ($filter('filter')($scope.submissions, $scope.isReviewerGroup).length > 0)
        };

        // --- Controlling the Tabs ---

        $scope.resetTabs = function(){
            for(var key in $scope.filterData.tabFilter) {
                if($scope.filterData.tabFilter.hasOwnProperty(key)){
                    $scope.filterData.tabFilter[key] = false;
                }
            }
        };

        $scope.showAllSubmissions = function(){
            $scope.resetTabs();
        };

        $scope.showMySubmissions = function(){
            $scope.resetTabs();
            $scope.filterData.tabFilter.isPresenter = true;
        };

        $scope.showMyCoSubmissions = function(){
            $scope.resetTabs();
            $scope.filterData.tabFilter.isCoPresenter = true;
        };

        $scope.showMyAdviserSubmissions = function(){
            $scope.resetTabs();
            $scope.filterData.tabFilter.isAdviser = true;
        };

        $scope.showMyReviewerSubmissions = function(){
            $scope.resetTabs();
            $scope.filterData.tabFilter.isReviewer = true;
        };


        $scope.tabFilters = function(submission){
          if($scope.filterData.tabFilter.isPresenter){
              return $scope.isPresenter(submission);
          }  else if ($scope.filterData.tabFilter.isCoPresenter) {
              return $scope.isCoPresenter(submission);
          } else if ($scope.filterData.tabFilter.isReviewer) {
              return $scope.reviewGroupFilter(submission);
          } else if ($scope.filterData.tabFilter.isAdviser) {
              return $scope.isAdviser(submission);
          } else {
              return true;
          }
        };

        // ----------------------- Getting Data from Mongo ----------------------------
        $scope.statusEdit = {
            editing: false,
            options: [],
            color: [],
            subject: [],
            body: [],
            temp: {strict: "", text: ""}
        };

        $scope.statusGet = function(){
            for(var x = 0; x<$scope.status.length; x++){
                $scope.statusEdit.options.push($scope.status[x].strict);
                $scope.statusEdit.color.push($scope.status[x].color);
                $scope.statusEdit.subject.push($scope.status[x].emailSubject);
                $scope.statusEdit.body.push($scope.status[x].emailBody);
            }
        };

        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            socket.syncUpdates('submission', $scope.submissions);
        });

        $http.get('/api/statuss').success(function(status) {
            $scope.status = status;
            $scope.statusGet();
            socket.syncUpdates('status', $scope.status);
        });

        //*******Needs to be updated with new status system******
        var sendGmail = function(opts){
            var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
                '&to=' + opts.to +
                '&su=' + opts.subject +
                '&body=' + opts.message +
                '&ui=1';
            $window.open(str);
        };

        //----------------------------- Color Coding of submission list -----------------------------

        $scope.statusColorTab = function(strict) {
            var index = $scope.statusEdit.options.indexOf(strict);
            if ($scope.statusEdit.color.length == 0 || index == -1) {
                return {'border-left': '4px solid rgba(255, 255, 255, 1)'};
            } else {
            return {'border-left': '4px solid rgba(' + $scope.statusEdit.color[index].red
                                               + ',' + $scope.statusEdit.color[index].green
                                               + ',' + $scope.statusEdit.color[index].blue +
                                                 ',' + $scope.statusEdit.color[index].alpha + ')'}
        }};

        $scope.statusColorBody = function(strict) {
            var index = $scope.statusEdit.options.indexOf(strict);
            if ($scope.statusEdit.color.length == 0 || index == -1) {
                return {'background-color': 'rgba(255, 255, 255, 1)'};
            } else {
                return {'background-color': 'rgba(' + $scope.statusEdit.color[index].red
                                                        + ',' + $scope.statusEdit.color[index].green
                                                        + ',' + $scope.statusEdit.color[index].blue +
                                                          ',' + $scope.statusEdit.color[index].alpha *.66 + ')'}
            }};


        // ---------------------- Controlling selection of submission for detail view ---------------------------------

        $scope.selection = {selected: false, item: null, resubmission: null};

        $scope.selectItem = function(itemIndex){
            var filteredSubmissions =
                $filter('filter')(
                    $filter('filter')(
                        $filter('filter')(
                            $filter('filter')(
                                $scope.submissions,
                                $scope.hasPermissions
                            ),
                            $scope.tabFilters
                        ),
                        $scope.reviewGroupFilter
                    ),
                    $scope.searchFilter
                );

            $scope.selection.selected = true;
            $scope.selection.item = filteredSubmissions[itemIndex];
            $scope.selection.resubmission = $scope.getResubmission($scope.selection.item);

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

        $scope.isApproved = function(submission) {
          return submission.approval;
        };

        $scope.approveSubmission = function(submission) {
            if($scope.isAdviser(submission) == true || $scope.hasAdminPrivs() == true){
                var r = confirm("Are you sure you want to approve this submission?");
                if(r == true){
                    $http.patch('api/submissions/' + $scope.selection.item._id,
                        {approval: true}
                    ).success(function(){
                            $scope.selection.item.approval = true;
                            console.log("Successfully updated approval of submission (approved)");
                        });
                    $http.patch('api/submissions/' + $scope.selection.item._id,
                        {status: {strict: "Reviewing in Process", text: "Your URS submission has been approved by your adviser"}}
                    ).success(function(){
                            $scope.selection.item.status.strict = "Reviewing in Process";
                            $scope.selection.item.status.text = "Your URS submission has been approved by your adviser, awaiting revisions";
                            console.log("Successfully changed status of submission");
                        });
                    sendGmail({
                        to: $scope.selection.item.presenterInfo.email +" "+ $scope.selection.item.copresenterOneInfo.email +" "+ $scope.selection.item.copresenterTwoInfo.email,
                        subject: $scope.statusEdit.subject,
                        message: $scope.selection.item.presenterInfo.first + ", your URS abstract has been approved by your adviser. Please await reviewer comments."
                    });
                }
            }
        };

        // -------------------------- Editing of status ----------------------------------------------

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


            //TODO: needs to be updated to work with the current status system
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

        //--------------------------------------------- Gmail Things ---------------------------------------

            sendGmail({
                to: $scope.selection.item.presenterInfo.email +" "+ $scope.selection.item.copresenterOneInfo.email +" "+ $scope.selection.item.copresenterTwoInfo.email,
                subject: $scope.statusEdit.subject[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)],
                message: $scope.selection.item.presenterInfo.first +
                    $scope.statusEdit.body[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)]
            });
            $scope.resetTemps();
            $scope.editStatus();
        };
        //TODO: broken, fix pls
        $scope.advisorApprover = function(){
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {approval: true}
            ).success(function(){
                    $scope.selection.item.approval = true;
                    console.log("Approve this submission");
                });
        };

        $scope.flagForResubmit = function(){
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {resubmissionData: {comment: "flagged for resubmit", parentSubmission: "", resubmitFlag: true}}
            ).success(function(){
                console.log("Successfully flagged submission for resubmit");
                //Might want to change so that owner of the submission is redirected.
                if(!$scope.hasAdminPrivs()){$location.path('/subform');}
            });
        };

        $scope.approvalWordChange = function(approval){
             if(approval){
                 return "Yes";
                 }
             else{
                 return "No";
                 }
             };

        //--------------------------------------------- Resubmission ---------------------------------------
        $scope.flagForResubmit = function(){
            console.log("Attempting to flag for resubmission.");
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {resubmissionData: {comment: "flagged for resubmit", parentSubmission: "", resubmitFlag: true}}
            ).success(function(){
                    console.log("Successfully flagged submission for resubmit");
                    if(!$scope.hasAdminPrivs()){$location.path('/subform');}
                });
        };

        //TODO: Right now anyone that can see a resubmission can approve a resubmission, so that needs to get fixed. Should wait to fix until the permissions system is sorted out.
        $scope.approveResubmit = function(){
            console.log("Attempting to approve resubmission.");
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {resubmissionData: {isPrimary: false}}
            ).success(function(){
                    console.log("old primary is no longer primary");
                    $http.patch('api/submissions/' + $scope.selection.resubmission._id,
                        {resubmissionData: {isPrimary: true}}
                    ).success(function(){
                        console.log("resubmission set as new primary")
                    });
            });
        };




        //--------------------------------------------- Comments ---------------------------------------

        $scope.addComment = function (submission) {
            console.log(submission.abstract.length);
            var commentObj = {};
            var comments = submission.comments;
            var selection = $window.getSelection();
            var commentText = prompt("Comment");
            commentObj.beginner = selection.anchorOffset;
            commentObj.ender = selection.focusOffset;
            commentObj.commentText = commentText;
            commentObj.selectionText = selection.toString();
            commentObj.indicator = 0;
            comments.push(commentObj);
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {comments: comments}
            ).success(function(){
                    console.log("successfully pushed comments to submission!");
                });
//            console.log(submission.comments);
//            console.log(submission.abstract.length);
//            console.log(comments.length);
//            $scope.populateComments(submission);
        };

        $scope.populateComments = function (submission) {
//            var submission = submission;
            var comments = submission.comments;
            for (var i = 0; i < comments.length; i++) {
                var start = comments[i].beginner;
                var end = comments[i].ender;
                if (i == 0 && comments[i].indicator == 0) {
                    submission.abstract = submission.abstract.substring(0, start) + '<b>' + submission.abstract.substring(start, end) + '</b>' + submission.abstract.substring(end, submission.abstract.length);
                    comments[i].indicator = 1;
                    console.log(submission.abstract);
                    console.log(i, "Cats");
                } else if (comments[i].indicator == 0){
                    start += 7 * (i + 2);
                    end += 7 * (i + 2);
                    submission.abstract = submission.abstract.substring(0, start) + '<b>' + submission.abstract.substring(start, end) + '</b>' + submission.abstract.substring(end, submission.abstract.length);
                    comments[i].indicator = 1;
                    console.log(submission.abstract);
                    console.log(start);
                    console.log(end);
                }
            }
            return submission.abstract;
        };

    });