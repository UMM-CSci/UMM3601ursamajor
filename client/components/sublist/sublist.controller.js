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
            return (!submission.resubmissionData.isPrimary);
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

        // Takes a String and sets the review group filter selection to that string.
        // Used for changing which review group filter is applied.
        $scope.setReviewGroupSelection = function(str) {
            $scope.filterData.reviewGroupFilterSelection = str;
        };

        // Takes no arguments and returns true if the user provided by Auth is an admin, or is in the admin group.
        $scope.hasAdminPrivs = function(){
            return (($scope.getCurrentUser.role != null && $scope.getCurrentUser.role == "Admin") || $scope.isAdmin() || $scope.isChair());
        };

        // Takes a submission as an argument and returns true if the user provided by Auth is listed as the primary presenter on that submission.
        // (based on email, not name)
        // Returns false if the submission is null, or the user isn't listed as the primary presenter.
        $scope.isPresenter = function(submission) {
            if(submission == null) return false;
            return $scope.email === submission.presenterInfo.email;
        };

        // Takes a submission as an argument and returns true if the user provided by Auth is listed as a co-presenter on that submission.
        // (based on email, not name)
        // Returns false if the submission is null, or if the user isn't listed as a co-presenter.
        $scope.isCoPresenter = function(submission) {
            if(submission == null) return false;
            return $scope.email === submission.copresenterOneInfo.email ||
                $scope.email === submission.copresenterTwoInfo.email;
        };

        // Takes a submission as an argument and returns true if the user provided by Auth is listed as the adviser on that submission.
        // (based on email, not name)
        // returns false if the submission is null, or if the user isn't listed as the adviser.
        $scope.isAdviser = function(submission) {
            if(submission == null) return false;
            return $scope.email === submission.adviserInfo.email;
        };

        // Takes a submission as an argument and returns true if the user provided by Auth is in the review group that the submission is assigned to.
        // returns false if the submission is null, or if the user isn't in the correct review group.
        $scope.isReviewerGroup = function(submission){
            if(submission == null) return false;
            return $scope.group === submission.group;
        };

        // Takes a submission and returns true if the user provided by Auth has permission to see that submission.
        // True if user has admin permissions
        // True if user is presenter or co-presenter of submission
        // True if user is the adviser of the submission
        // True if the user is in the review group that the submission is assigned to.
        // False if the submission is null, or if one of the above conditions is not met.
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

        // Takes a submission as an argument and returns a boolean based on which review group filter is applied.
        // Always returns true if filter selection is "All"
        // Otherwise returns true if the submission is assigned to the selected review group (0 - 4), false otherwise.
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

        //Returns true if the current user is listed as a presenter on ANY submission, false otherwise.
        $scope.isPresenterOnAnything = function(){
           return ($filter('filter')($scope.submissions, $scope.isPresenter).length > 0)
        };

        //Returns true if the current user is listed as a co-presenter on ANY submission, false otherwise.
        $scope.isCoPresenterOnAnything = function(){
            return ($filter('filter')($scope.submissions, $scope.isCoPresenter).length > 0)
        };

        //Returns true if the current user is listed as an adviser on ANY submission, false otherwise.
        $scope.isAdviserOfAnything = function(){
            return ($filter('filter')($scope.submissions, $scope.isAdviser).length > 0)
        };

        //Returns true if the current user's review group matches that of ANY submission, false otherwise.
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
            priority: [],
            temp: {strict: "", text: ""}
        };

        $scope.statusGet = function(){
            for(var x = 0; x<$scope.status.length; x++){
                $scope.statusEdit.options.push($scope.status[x].strict);
                $scope.statusEdit.color.push($scope.status[x].color);
                $scope.statusEdit.subject.push($scope.status[x].emailSubject);
                $scope.statusEdit.body.push($scope.status[x].emailBody);
                $scope.statusEdit.priority.push($scope.status[x].priority);
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

        $http.get('/api/users').success(function(users) {
            $scope.users = users;
            socket.syncUpdates('user', $scope.users)
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

        $scope.selection = {selected: false, item: null, resubmission: null, reviewGroup: 0};

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
            $scope.selection.reviewGroup = $scope.selection.item.group;

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
          if(submission == null) return false;
          return submission.approval;
        };

        $scope.approveSubmission = function(submission) {
            if($scope.isAdviser(submission) == true || $scope.hasAdminPrivs() == true){
                var r = confirm("Are you sure you want to approve this submission?");
                console.log(submission);

                if(r){
                    for(var i = 0; i < $scope.statusEdit.priority.length; i++){
                        if($scope.statusEdit.priority[i] == 2){
                            $scope.selection.item.status.strict = $scope.statusEdit.options[i];
                            for(var j = 0; j < $scope.submissions.length; j++){
                                if($scope.selection.item._id == $scope.submissions[j]._id){
                                    console.log("Updates the strict of the current submission.");
                                    $scope.submissions[j].strict = $scope.statusEdit.options[i];
                                }
                            }

                            //$scope.selection.item.status.text = status[i].text;
                            $http.patch('api/submissions/' + $scope.selection.item._id,
                                {approval: true,
                                status: {strict: $scope.selection.item.status.strict, text: $scope.selection.item.status.text}}
                            ).success(function(){
                                    $scope.selection.item.approval = true;
                                    console.log("Successfully updated approval of submission (approved)");
                                });
                        }
                    }



                    sendGmail({
                        to: $scope.selection.item.presenterInfo.email +" "+ $scope.selection.item.copresenterOneInfo.email +" "+ $scope.selection.item.copresenterTwoInfo.email,
                        subject: $scope.statusEdit.subject,
                        message: $scope.selection.item.presenterInfo.first + ", your URS abstract has been approved by your adviser. Please await reviewer comments."
                    });
                }
            }
        };

        // -------------------------- Editing of status ----------------------------------------------

        $scope.groupOptions =
            [   1,
                2,
                3,
                4
            ];

        $scope.getReviewGroupMembers = function(group) {
            return $filter('filter')($scope.users,
                function(user) {
                    return user.group == group;
                })
        };

        $scope.checkForConflict = function(submission) {
            console.log("checking for conflicts for: " + submission.title + " and review group " + $scope.selection.reviewGroup);
            if (
                $filter('filter')($scope.getReviewGroupMembers($scope.selection.reviewGroup),
                    function(user) {
                        return user.email === submission.copresenterOneInfo.email || user.email === submission.presenterInfo.email || user.email === submission.adviserInfo.email || user.email === submission.copresenterTwoInfo.email;
                    }
                ).length > 0
                ) {
                console.log("Conflict with submission and review group.");
                alert('Conflict with submission and review group.');
            }
        };

        $scope.setReviewGroup = function(submission) {
            $scope.checkForConflict(submission);
            var bl = confirm('Are you sure you want to change this submissions review group?');
            if(bl) {
                console.log(bl);
                $http.patch('api/submissions/' + submission._id,
                    {group: $scope.selection.reviewGroup}
                ).success(function(){
                        console.log("Successfully updated status of submission");
                        submission.group = $scope.selection.reviewGroup;
                });
            }
        };

        $scope.resetTemps = function() {
            if($scope.selection.item != null){
                $scope.statusEdit.temp.strict = $scope.selection.item.status.strict;
                $scope.statusEdit.temp.text = $scope.selection.item.status.text;
            }
        };

        $scope.resetTemps();

        $scope.editStatus = function(){
            if($scope.hasAdminPrivs()) {
                $scope.statusEdit.editing = !$scope.statusEdit.editing;
                $scope.resetTemps();
            }
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
                {resubmissionData: {comment: $scope.selection.item.resubmissionData.comment, parentSubmission: $scope.selection.item.resubmissionData.parentSubmission, resubmitFlag: true, isPrimary: true}}
            ).success(function(){
                    console.log("Successfully flagged submission for resubmit");
                    if(!$scope.hasAdminPrivs()){$location.path('/subform');}
            });

            //Playing with trying to use the Submission service instead of the above http request (as per the role change controller)
//            Submission.update({id: $scope.selection.item._id},
//                {resubmissionData: {comment: "flagged for resubmit", parentSubmission: $scope.selection.item.resubmissionData.parentSubmission, resubmitFlag: true}}
//            ).success(function(){
//                    console.log("successfully flagged submission for resubmit");
//                    $scope.selection.item.resubmissionData.resubmitFlag = true;
//                    if(!$scope.hasAdminPrivs()){$location.path('/subform');}
//            });
        };

        //TODO: Right now anyone that can see a resubmission can approve a resubmission, so that needs to get fixed. Should wait to fix until the permissions system is sorted out.
        $scope.approveResubmit = function(){
            console.log("Attempting to approve resubmission.");
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {resubmissionData: {isPrimary: false, comment: $scope.selection.item.resubmissionData.comment, parentSubmission:  $scope.selection.item.resubmissionData.parentSubmission, resubmitFlag: false}}
            ).success(function(){
                    console.log("old primary is no longer primary");
                    $http.patch('api/submissions/' + $scope.selection.resubmission._id,
                        {resubmissionData: {isPrimary: true, comment: $scope.selection.resubmission.resubmissionData.comment, parentSubmission:  $scope.selection.resubmission.resubmissionData.parentSubmission, resubmitFlag: false}}
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
            var commenter = $scope.getCurrentUser().name;
            var selection = $window.getSelection();
            var commentText = prompt("Comment");
            if(selection.anchorOffset <= selection.focusOffset) {
                commentObj.beginner = selection.anchorOffset;
                commentObj.ender = selection.focusOffset;
            } else if(selection.anchorOffset > selection.focusOffset){
                commentObj.ender = selection.anchorOffset;
                commentObj.beginner = selection.focusOffset;
            }
            commentObj.commentText = commentText;
            commentObj.commenter = commenter;
            commentObj.selectionText = selection.toString();
            commentObj.indicator = 0;
            commentObj.responses = [];
            commentObj.timestamp = Date();
            comments.push(commentObj);
            console.log(comments);
            $http.patch('api/submissions/' + submission._id,
                {comments: comments}
            ).success(function(){
                    console.log("successfully pushed comments to submission!");
                });
            console.log(submission.comments);
        };

        $scope.populateComments = function (submissionCopy , index) {
            var submission = submissionCopy;
            var abstract = submission.abstract;
            var comments = submission.comments;
            var start = comments[index].beginner;
            var end = comments[index].ender;
            abstract = abstract.substring(0, start) + '<b>' + abstract.substring(start, end) + '</b>' + abstract.substring(end, abstract.length);
            var newWindow = $window.open("", null, "height=300,width=600,status=yes,toolbar=no,menubar=no,location=no");
            newWindow.document.write("<b>"+"Comment made by " + comments[index].commenter + ": " +"</b>"+"<i>" + comments[index].commentText + "</i>");
            newWindow.document.write("<br>");
            newWindow.document.write(abstract);
        };

        $scope.showResponses = false;

        $scope.addResponse = function (submission, index){
            var comments = submission.comments;
            var comment = comments[index];
            var responseObj = {};
            var response = prompt("response");
            responseObj.response = response;
            responseObj.responder = $scope.getCurrentUser().name;
            responseObj.timestamp = Date();
            comment.responses.push(responseObj);
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {comments: comments}
            ).success(function(){
                    console.log("successfully pushed comments to submission!");
                });
            console.log(comment.responses);
        };

        $scope.deleteComment = function (submission, index){
            var comments = submission.comments;
            if (confirm("Do you wish to delete this comment and all of its responses?")) {
                comments.splice(index, 1);
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {comments: comments}
                ).success(function(){
                        console.log("successfully pushed comments to submission!");
                    });
            }
        };

        $scope.deleteResponse = function (submission, parentIndex, childIndex){
            var comments = submission.comments;
            if (confirm("Do you wish to delete this response?")) {
                comments[parentIndex].responses.splice(childIndex, 1);
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {comments: comments}
                ).success(function(){
                        console.log("successfully pushed comments to submission!");
                    });
            }
        };

    });