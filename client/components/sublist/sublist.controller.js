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

  //Filter for checking if a submission's review group number is equal to 0, if not, display it.
    .filter('isntEqualToZero', function(){
        return function(input, title, altTitle){
            if(input !== 0){
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

    .controller('SublistCtrl', function($scope, $http, socket, $modal, Modal, Auth, $window, $filter, $location, $timeout) {
        $scope.submissions = [];
        $scope.status = [];

        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.group = Auth.getCurrentUser().group;
        $scope.email = Auth.getCurrentUser().email;
        $scope.isReviewer = Auth.isReviewer;
        $scope.isAdmin = Auth.isAdmin;
        $scope.isChair = Auth.isChair;
        $scope.showVotes = false;


        //--------------------- Function to measure time for the loading icon. ------------------------
        $scope.timeoutBoolean = true; // Should be true when delay is not reached yet.
        $timeout(function () { $scope.timeoutBoolean = false }, 7500);


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
            tabFilter: {isPresenter:false, isCoPresenter:false, isReviewer:false, isAdviser:false},
            featurePresentationFilterSelection: "All",
            featurePresentationFilterOptions: [
                "All",
                "Wants to be featured",
                "No desire to be featured"
            ],
            flaggedForResubmitFilterSelection: "All",
            flaggedForResubmitFilterOptions: [
                "All",
                "Flagged",
                "Not Flagged"
            ],
            pendingResubmissionsSelection: "All",
            pendingResubmissionsOptions: [
                "All",
                "Pending Resubmissions",
                "Not Pending Resubmissions"
            ],
            sortOptionsSelection:"Importance",
            sortOptions: [
                "Importance",
                "Newest",
                "Oldest"
            ],
            statusOptionsSelection:"All",
            statusOptions: ["All"]
        };

        // Returns true if a submission has a status that is not the default and it also does not have adviser approval.
        $scope.statusApprovalConflict = function(submission) {
            //console.log("submission");

            if(submission == null) return false;
            return (submission.status.priority != -15 && !submission.approval);
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

        $scope.hasResubmissions = function(submission){
            return ($scope.getResubmission(submission) != null);
        };

        // Takes a String and sets the review group filter selection to that string.
        // Used for changing which review group filter is applied.
        $scope.setReviewGroupSelection = function(str) {
            $scope.filterData.reviewGroupFilterSelection = str;
        };

        // Takes a String and sets the feature presentation filter selection to that string.
        // Used for changing which feature presentation search is applied.
        $scope.setFeaturePresentationFilterSelection = function(str) {
            $scope.filterData.featurePresentationFilterSelection = str;
        };

        // Takes a String and sets the flag for resubmit filter selection to that string.
        // Used for changing which flag for resubmit search is applied.
        $scope.setFlaggedForResubmitFilterSelection = function(str) {
            $scope.filterData.flaggedForResubmitFilterSelection = str;
        };

        $scope.setPendingResubmissionsSelection = function(str) {
            $scope.filterData.pendingResubmissionsSelection = str;
        };

        // Takes no arguments and returns true if the user provided by Auth is an admin, or is in the admin group, or is a chair.
        //Not sure why we need first case of not empty and is Admin?
        $scope.hasAdminPrivs = function(){
            return (($scope.getCurrentUser.role != null && $scope.getCurrentUser.role == "Admin") || $scope.isAdmin() || $scope.isChair());
        };

        // Takes a submission as an argument and returns true if the user provided by Auth is listed as the primary presenter on that submission.
        // (based on email, not name)
        // Returns false if the submission is null, or the user isn't listed as the primary presenter.
        $scope.isPresenter = function(submission) {
            if(submission == null) return false;
            return $scope.getCurrentUser().email === submission.presenterInfo.email;
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
            if($scope.email === submission.adviserInfo.email ||
                $scope.email === submission.coadviserOneInfo.email ||
                $scope.email === submission.coadviserTwoInfo.email){
                return true;
            } else {
                return false;
            }
        };

        $scope.isPrimaryAdviser = function(submission) {
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
                return submission.group == 0 || submission.group == -1;
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

        $scope.featurePresentationFilter = function(submission) {
            if($scope.filterData.featurePresentationFilterSelection === "All"){
                return true;
            } else if($scope.filterData.featurePresentationFilterSelection === "Wants to be featured"){
                return submission.featured === true;
            } else if($scope.filterData.featurePresentationFilterSelection === "No desire to be featured"){
                return submission.featured === false;
            } else {
                return false;
            }
        };

        $scope.flaggedForResubmitFilter = function(submission) {
            if($scope.filterData.flaggedForResubmitFilterSelection === "All"){
                return true;
            } else if($scope.filterData.flaggedForResubmitFilterSelection === "Flagged"){
                return submission.resubmissionData.resubmitFlag === true;
            } else if($scope.filterData.flaggedForResubmitFilterSelection === "Not Flagged"){
                return submission.resubmissionData.resubmitFlag === false;
            } else {
                return false;
            }
        };

        $scope.pendingResubmissionsFilter = function(submission) {
            if($scope.filterData.pendingResubmissionsSelection === "All"){
                return true;
            } else if($scope.filterData.pendingResubmissionsSelection === "Pending Resubmissions"){
                return $scope.getResubmission(submission) != null;
            } else if($scope.filterData.pendingResubmissionsSelection === "Not Pending Resubmissions"){
                return $scope.getResubmission(submission) === null;
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
                (submission.adviserInfo.last.toLowerCase().indexOf(searchText) != -1) ||
                (submission.coadviserOneInfo.first.toLowerCase().indexOf(searchText) != -1) ||
                (submission.coadviserOneInfo.last.toLowerCase().indexOf(searchText) != -1) ||
                (submission.coadviserTwoInfo.first.toLowerCase().indexOf(searchText) != -1)||
                (submission.coadviserTwoInfo.last.toLowerCase().indexOf(searchText) != -1)
                )
        };

        $scope.statusFilter = function(submission){
          if($scope.filterData.statusOptionsSelection === "All"){
            return true;
          }
          else {
            return submission.status.strict === $scope.filterData.statusOptionsSelection;
          }
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
                $scope.filterData.statusOptions.push($scope.status[x].strict);
            }
        };

        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            socket.syncUpdates('submission', $scope.submissions);
            $scope.submissions.sort($scope.subCompareImportance);
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

        var sendGmail = function(opts){
            var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
                '&to=' + opts.to +
                '&su=' + opts.subject +
                '&body=' + opts.message +
                '&ui=1';
            $window.open(str);
        };

        var sendGmailWithCC = function(opts){
            var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
                '&to=' + opts.to +
                '&cc=' + opts.cc +
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
                                $scope.featurePresentationFilter
                            ),
                            $scope.flaggedForResubmitFilter
                        ),
                        $scope.pendingResubmissionsFilter
                    ),
                    $scope.searchFilter
                );

            $scope.selection.selected = true;
            $scope.selection.item = filteredSubmissions[itemIndex];
//            console.log("submissions");
//            console.log(filteredSubmissions);
            $scope.selection.resubmission = $scope.getResubmission($scope.selection.item);
            $scope.selection.reviewGroup = $scope.selection.item.group;

            $scope.setVoteOptions();

            $scope.resetTemps();
        };

        $scope.resetSelection = function(){
            $scope.selection.selected = false;
            $scope.resetTemps();
        };

        $scope.deleteSubmissionConfirm = function(item) {
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

        $scope.approveSubmissionConfirm = function(submission){
            Modal.confirm.approval($scope.approveHelpYes,$scope.approveHelpNo)("You are approving: [" + $scope.selection.item.title + "], would you like to receive e-mail updates on changes of this submission?", submission);
        };

        $scope.approveHelpNo = function(submission){
            $scope.approveSubmission(submission);
            sendGmailWithCC({
                to: $scope.selection.item.presenterInfo.email + " " + $scope.selection.item.copresenterOneInfo.email + " " + $scope.selection.item.copresenterTwoInfo.email,
                cc: 'ursadmin@morris.umn.edu',
                subject: "[" + $scope.selection.item.title + "] " + $scope.statusEdit.subject[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)],
                message: $scope.selection.item.presenterInfo.first + ", your URS abstract has been approved by your adviser. Please await reviewer comments."
            });
        };

        $scope.approveHelpYes = function(submission){
            $scope.approveSubmission(submission);
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {cc: true}).success(function(){
                    $scope.selection.item.cc = true;
                    console.log("Successfully updated approval of submission with CC checked");
                });
            sendGmailWithCC({
                to: $scope.selection.item.presenterInfo.email + " " + $scope.selection.item.copresenterOneInfo.email + " " + $scope.selection.item.copresenterTwoInfo.email,
                cc: $scope.selection.item.adviserInfo.email + " " + 'ursadmin@morris.umn.edu',
                subject: "[" + $scope.selection.item.title + "] " + $scope.statusEdit.subject[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)],
                message: $scope.selection.item.presenterInfo.first + ", your URS abstract has been approved by your adviser. Please await reviewer comments."
            });
        };

        $scope.approveSubmission = function(submission) {
            if($scope.isAdviser(submission) == true || $scope.hasAdminPrivs() == true){
                console.log("submission");
                var newPriority = 15;
                for (var k = 0; k < $scope.statusEdit.priority.length; k++) {
                    if ($scope.statusEdit.priority[k] < newPriority && $scope.statusEdit.priority[k] != -15) {
                        newPriority = $scope.statusEdit.priority[k]
                    }
                }
                for (var i = 0; i < $scope.statusEdit.priority.length; i++) {
                    if ($scope.statusEdit.priority[i] == newPriority) {
                        $scope.selection.item.status.strict = $scope.statusEdit.options[i];
                        for (var j = 0; j < $scope.submissions.length; j++) {
                            if ($scope.selection.item._id == $scope.submissions[j]._id) {
                                console.log("Updates the strict of the current submission.");
                                $scope.submissions[j].strict = $scope.statusEdit.options[i];
                            }
                        }
                        //$scope.selection.item.status.text = status[i].text;
                        $http.patch('api/submissions/' + $scope.selection.item._id,
                            {approval: true,
                             rejection: false,
                             status: {strict: $scope.selection.item.status.strict, priority: $scope.statusEdit.priority[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)], text: "This URS submission has been approved by an adviser."}}
                        ).success(function () {
                                $scope.selection.item.approval = true;
                                $scope.selection.item.rejection = false;
                                console.log("Successfully updated approval of submission (approved)");
                            });
                    }
                }
                $scope.selection.item.status.text = "This URS Submission has been approved by an adviser.";
            }
        };


        $scope.rejectSubmissionConfirmHelp = function(item){
            Modal.confirm.option($scope.rejectHelpYes, $scope.rejectHelpNo)("Would you like to include the presenter to the generated email?", item);
        };


        $scope.rejectSubmissionConfirm = function(item){
            Modal.confirm.reject($scope.rejectSubmissionConfirmHelp)($scope.selection.item.title, item);
        };

        $scope.rejectHelpYes = function(item){
            $scope.rejectSubmission(item);
            sendGmailWithCC({
                to: $scope.selection.item.presenterInfo.email +" "+ $scope.selection.item.copresenterOneInfo.email +" "+ $scope.selection.item.copresenterTwoInfo.email,
                cc: "ursadmin@morris.umn.edu",
                subject: "["+ $scope.selection.item.title + "] " + "URS submission has been rejected",
                message: $scope.selection.item.presenterInfo.first + ", unfortunately, your URS submission has been rejected."
            });
        };

        $scope.rejectHelpNo = function(item){
            $scope.rejectSubmission(item);
            sendGmail({
                to: "ursadmin@morris.umn.edu",
                subject: "["+ $scope.selection.item.title + "] " + "URS submission has been rejected",
                message: $scope.selection.item.presenterInfo.first + " submitted an abstract for consideration to the URS. Unfortunately, I, as the adviser, have rejected this submission."
            });
        };

        //currently have ursadmin@morris.umn.edu hard-coded in because this is the email address for the URSA Major admin group,
        //CANNOT ADD IN CHAIRS' EMAILS TO SENDGMAILS BECAUSE OF THE SECURITY PRIVILEGES, SO FOR NOW WE'LL JUST SEND TO ADMIN
        $scope.rejectSubmission = function(submission) {
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {rejection: true,
                    status: {strict: $scope.statusEdit.options[$scope.statusEdit.priority.indexOf(14)], priority: 14, text: "The submission has been rejected by an adviser."}}
            ).success(function(){
                    $scope.selection.item.rejection = true;
                    $scope.selection.item.status.strict = $scope.statusEdit.options[$scope.statusEdit.priority.indexOf(14)];
                    $scope.selection.item.status.text = "The submission has been rejected by an adviser.";
                });
        };

        // -------------------------- Editing of status ----------------------------------------------

        $scope.groupOptions =
            [   1,
                2,
                3,
                4
            ];

        $scope.reviewOptions = [
            'Accepted without changes',
            'Minor revisions',
            'Major revisions',
            'Total rewrite'
        ];

        $scope.voteHide = function(sub) {
          if (sub == null) return true;

          if(sub.status.priority == -15 || sub.status.priority == -14 || sub.status.priority == 15) {
              return true;
          }

          return false;
        };

        $scope.voteOption = "";

        //Sets the starting vote option for a reviewer when they go into a submission
        $scope.setVoteOptions = function(){
            var userIdent = {name: $scope.getCurrentUser().name, email: $scope.getCurrentUser().email};
            if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Accepted, userIdent) != -1){
                $scope.voteOption = 'Accepted without changes';
            }
            else if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Minor, userIdent) != -1){
                $scope.voteOption = 'Minor revisions';
            }
            else if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Major, userIdent) != -1){
                $scope.voteOption = 'Major revisions';
            }
            else if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.TotalRewrite, userIdent) != -1){
                $scope.voteOption = 'Total rewrite';
            }
        };


        //Used for the vote on status, turns an array of names into a string
        $scope.arrayToString = function(arr){
          if(arr == null){
            return "";
          }
          var nameString = "";
          for(var i = 0; i < arr.length; i++){
            if(i + 1 < arr.length){
              nameString += arr[i].name;
              nameString += ", ";
            }
            else{
              nameString += arr[i].name;
            };
          };
          return nameString;
        };

        $scope.indexOfJsonArray = function(arr, item){
          var index = -1;
          for(var i = 0; i < arr.length; i++){
            if(arr[i].email == item.email){
              index = i;
            }
          }
          return index;
        };

        $scope.subCompareImportance = function(sub1, sub2){
          if($scope.votingValue(sub1) < $scope.votingValue(sub2)){
            return -1;
          }
          if($scope.votingValue(sub1) > $scope.votingValue(sub2)){
            return 1;
          }
          return 0;
        };

        $scope.subCompareDatesOldFirst = function(sub1, sub2){
          var date1 = new Date(sub1.timestamp);
          var date2 = new Date(sub2.timestamp);

          if(date1 < date2){
            return -1;
          }
          if(date1 > date2){
            return 1;
          }
          return 0;
        };

        $scope.subCompareDatesNewFirst = function(sub1, sub2){
          var date1 = new Date(sub1.timestamp);
          var date2 = new Date(sub2.timestamp);

          if(date1 < date2){
            return 1;
          }
          if(date1 > date2){
            return -1;
          }
          return 0;
        };

        $scope.sortSubmissions = function(sortName){
          if(sortName === "Importance"){
            $scope.submissions.sort($scope.subCompareImportance);
          }
          else if(sortName === "Oldest"){
            $scope.submissions.sort($scope.subCompareDatesOldFirst);
          }
          else if(sortName === "Newest"){
            $scope.submissions.sort($scope.subCompareDatesNewFirst);
          }
        };

        $scope.votingValue = function(submission){
            return Math.pow(submission.reviewVotes.Accepted.length,2) +
                   Math.pow(submission.reviewVotes.Minor.length,2) +
                   Math.pow(submission.reviewVotes.Major.length,2) +
                   Math.pow(submission.reviewVotes.TotalRewrite.length,2);
        };

        $scope.updateReviewVotingConfirm = function(item){
            Modal.confirm.info($scope.updateReviewVoting)('Are you sure you would like to vote on this?', item)
        };
        //TODO: update arrays to hold objects containing names and emails instead of just names.
        $scope.updateReviewVoting = function(value){
            var userIdent = {name: $scope.getCurrentUser().name, email: $scope.getCurrentUser().email};
            if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Accepted, userIdent) != -1){
                console.log("accepted detected");
                $scope.selection.item.reviewVotes.Accepted.splice($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Accepted, userIdent), 1);
            }
            else if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Minor, userIdent) != -1){
                $scope.selection.item.reviewVotes.Minor.splice($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Minor, userIdent), 1);
            }
            else if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Major, userIdent) != -1){
                $scope.selection.item.reviewVotes.Major.splice($scope.indexOfJsonArray($scope.selection.item.reviewVotes.Major, userIdent), 1);
            }
            else if($scope.indexOfJsonArray($scope.selection.item.reviewVotes.TotalRewrite, userIdent) != -1){
                $scope.selection.item.reviewVotes.TotalRewrite.splice($scope.indexOfJsonArray($scope.selection.item.reviewVotes.TotalRewrite, userIdent), 1);
            } else {

                console.log("This should appear first")
            }

            switch(value){
              case 'Accepted without changes':
                    $scope.selection.item.reviewVotes.Accepted.splice($scope.selection.item.reviewVotes.Accepted.length, 0, userIdent);
                    console.log("This should appear Accepted");
                    $scope.submitVoting();
                    break;
                case 'Minor revisions':
                    $scope.selection.item.reviewVotes.Minor.splice($scope.selection.item.reviewVotes.Minor.length, 0, userIdent);
                    console.log("This should appear Minor");
                    $scope.submitVoting();
                    break;
                case 'Major revisions':
                    $scope.selection.item.reviewVotes.Major.splice($scope.selection.item.reviewVotes.Major.length, 0, userIdent);
                    console.log("This should appear Major");
                    $scope.submitVoting();
                    break;
                case 'Total rewrite':
                    $scope.selection.item.reviewVotes.TotalRewrite.splice($scope.selection.item.reviewVotes.TotalRewrite.length, 0, userIdent);
                    console.log("This should appear TotalRewrite");
                    $scope.submitVoting();
                    break;
            }


        };

        $scope.submitVoting = function() {
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {reviewVotes: {Accepted: $scope.selection.item.reviewVotes.Accepted,
                    Minor: $scope.selection.item.reviewVotes.Minor,
                    Major: $scope.selection.item.reviewVotes.Major,
                    TotalRewrite: $scope.selection.item.reviewVotes.TotalRewrite}
            }).success(function(){
                    console.log("Updated Votes")
                })
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

        $scope.submitStatusEditConfirm = function(){
            Modal.confirm.option($scope.statusEditHelpYes,$scope.submitStatusEdit)('Would you like to generate an email for the status change?')

        };

        $scope.statusEditHelpYes = function(){
            $scope.submitStatusEdit();
            if($scope.selection.item.cc){
                sendGmailWithCC({
                    to: $scope.selection.item.presenterInfo.email + " " + $scope.selection.item.copresenterOneInfo.email + " " + $scope.selection.item.copresenterTwoInfo.email,
                    cc: $scope.selection.item.adviserInfo.email,
                    subject: "[" + $scope.selection.item.title + "] " + $scope.statusEdit.subject[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)],
                    message: $scope.selection.item.presenterInfo.first +
                        $scope.statusEdit.body[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)]
                });
            }else {
                sendGmail({
                    to: $scope.selection.item.presenterInfo.email + " " + $scope.selection.item.copresenterOneInfo.email + " " + $scope.selection.item.copresenterTwoInfo.email,
                    subject: "[" + $scope.selection.item.title + "] " + $scope.statusEdit.subject[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)],
                    message: $scope.selection.item.presenterInfo.first +
                        $scope.statusEdit.body[$scope.statusEdit.options.indexOf($scope.selection.item.status.strict)]
                });
            }
        };

        $scope.submitStatusEdit = function(){
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {status: {strict: $scope.statusEdit.temp.strict, priority: $scope.statusEdit.priority[$scope.statusEdit.options.indexOf($scope.statusEdit.temp.strict)], text: $scope.statusEdit.temp.text}}
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

        $scope.approvalWordChange = function(approval){
            if(approval){
                return "Yes";
            } else {
                return "No";
            }
        };

        //--------------------------------------------- Resubmission ---------------------------------------
        $scope.showResubmitButton = function(){
            if($scope.selection.item == null){
                return {
                    show: false,
                    style: "btn-danger",
                    text: "Null",
                    action: function(){alert('something has gone horribly wrong');}
                }
            }

            if($scope.hasAdminPrivs()){
                if($scope.selection.item.resubmissionData.resubmitFlag){
                    return {
                        show: true,
                        style: "btn-warning",
                        text: "Remove Resubmit Flag",
                        action: function(){$scope.removeResumitFlagConfirm();}
                    }
                } else if ($scope.hasResubmissions($scope.selection.item)) {
                  return {
                    show: false,
                    style: "btn-warning",
                    text: "You shouldn't see this.",
                    action: function(){alert('something has gone horribly wrong');}
                  }
                } else {
                    return {
                        show: true,
                        style: "btn-primary",
                        text: "Flag for Re-Submission",
                        action: function(){
                            $scope.flagForResubmitConfirm();
                        }
                    };
                }
            } else if(!$scope.hasResubmissions($scope.selection.item) && $scope.selection.item.approval && !$scope.selection.item.resubmissionData.resubmitFlag){
                return {
                    show: $scope.isPresenter($scope.selection.item),
                    style: "btn-primary",
                    text: "Re-Submit this Submission",
                    action: function(){$scope.flagForResubmitConfirm();}
                }
            } else if($scope.selection.item.resubmissionData.resubmitFlag && $scope.isPresenter($scope.selection.item)) {
                return {
                    show: true,
                    style: "btn-primary",
                    text: "Click to Resubmit",
                    action: function(){$location.path('/subform');}
                }
            } else {
                //this will usually happen when the submission meets criteria for resubmission, but lacks approval.
                return {
                    show: false,
                    style: "btn-danger",
                    text: "Error!?!",
                    action: function(){alert('something has gone horribly wrong');}
                }
            }
        };

        $scope.flagForResubmitConfirm = function(){
            Modal.confirm.info($scope.flagForResubmit)('Are you sure you want to flag this submission for resubmission?');
        };

        $scope.flagForResubmit = function(){
            console.log("Attempting to flag for resubmission.");
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {
                    resubmissionData: {comment: $scope.selection.item.resubmissionData.comment, parentSubmission: $scope.selection.item.resubmissionData.parentSubmission, resubmitFlag: true, isPrimary: true}
                }
            ).success(function(){
                    console.log("Successfully flagged submission for resubmit");
                    $scope.selection.item.resubmissionData.resubmitFlag = true;
                    if (!$scope.hasAdminPrivs())
                    {$location.path('/subform');}
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

        $scope.removeResumitFlagConfirm = function(){
            Modal.confirm.info($scope.removeResubmitFlag)('Are you sure you want to remove the re-submission flag?');
        };

        $scope.removeResubmitFlag = function(){
            console.log("Attempting to remove resubmit flag.");
            $http.patch('api/submissions/' + $scope.selection.item._id,
                {
                    resubmissionData: {comment: $scope.selection.item.resubmissionData.comment, parentSubmission: $scope.selection.item.resubmissionData.parentSubmission, resubmitFlag: false, isPrimary: true}
                }
            ).success(function(){
                    console.log("Successfully removed resubmit flag");
                    $scope.selection.item.resubmissionData.resubmitFlag = false;
                });
        };

        $scope.approveResubmitConfirm = function(){
            Modal.confirm.info($scope.approveResubmit)('Are you sure you want to approve this resubmission?');
        };

        $scope.approveResubmit = function(){
            var reviewGroup = $scope.selection.item.group;
                console.log("Attempting to approve resubmission.");
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {
                        resubmissionData: {isPrimary: false, comment: $scope.selection.item.resubmissionData.comment, parentSubmission: $scope.selection.item.resubmissionData.parentSubmission, resubmitFlag: false}
                    }
                ).success(function () {
                        console.log("old primary is no longer primary");
                        $http.patch('api/submissions/' + $scope.selection.resubmission._id,
                            {
                                resubmissionData: {isPrimary: true, comment: $scope.selection.resubmission.resubmissionData.comment, parentSubmission: $scope.selection.resubmission.resubmissionData.parentSubmission, resubmitFlag: false},
                                group: reviewGroup
                            }
                        ).success(function () {
                                $scope.selection.item.resubmissionData.isPrimary = false;
                                $scope.selection.resubmission.resubmissionData.isPrimary = true;
                                $scope.selection.item = $scope.selection.resubmission;
                                $scope.selection.resubmission = null;
                                $scope.selection.item.group = reviewGroup;
                                console.log("resubmission set as new primary")
                            });
                    });
        };


        //--------------------------------------------- Comments ---------------------------------------

        $scope.selectedCommentIndex = 10000;
        $scope.currentCommentPage = 1;

        $scope.menuToggle = false;

        $scope.toggleCommentDropdown = function(){
            $scope.menuToggle = !$scope.menuToggle;
        };

        //Selects a comment nd sets its index
        $scope.selectComment = function(index) {
            console.log("setting selected comment: " + index);
            if(index == $scope.selectedCommentIndex){
                console.log("case 1 ");
            } else {
                console.log("case 2 ");
                $scope.selectedCommentIndex = index;
            }
        };

        //Checks if a comment is the currently selected comment
        $scope.isSelectedComment = function(index){
            return index == $scope.selectedCommentIndex;
        };

        //Controls and restricts the number of comments to display
        $scope.displayedComments = function() {
            if($scope.selection.item == null) return [];

            if($scope.selection.item.comments.length == 0) {
                return [];
            } else if ($scope.selection.item.comments.length < 11) {
                return $scope.selection.item.comments;
            } else {
                return $scope.selection.item.comments.slice(($scope.currentCommentPage - 1) * 10, $scope.currentCommentPage * 10)
            }
        };

        $scope.transformCommentIndex = function(index){
            return ((10*($scope.currentCommentPage - 1)) + index);
        };

        //Creates a comment Object and patches it to the database
        $scope.addComment = function (submission) {
            var commentObj = {};
            var comments = submission.comments;
            var commenter = $scope.getCurrentUser().name;
            var selection = $window.getSelection();
            var commentText = prompt("Comment");
          if(selection.anchorNode != null) {
            if (selection.anchorNode.data && selection.focusNode.data == submission.abstract) {
              if (selection.anchorOffset <= selection.focusOffset) {
                commentObj.beginner = selection.anchorOffset;
                commentObj.ender = selection.focusOffset;
              } else if (selection.anchorOffset > selection.focusOffset) {
                commentObj.ender = selection.anchorOffset;
                commentObj.beginner = selection.focusOffset;
              }
            } else {
              commentObj.beginner = 0;
              commentObj.ender = 0;
            }
          } else {
            commentObj.beginner = 0;
            commentObj.ender = 0;
          }
            commentObj.commentText = commentText;
            commentObj.commenter = commenter;
            commentObj.selectionText = selection.toString();
            commentObj.indicator = 0;
            commentObj.responses = [];
            commentObj.timestamp = Date();
            commentObj.origin = submission._id;
            if(commentText != null && commentText != "") {
                comments.push(commentObj);
                $http.patch('api/submissions/' + submission._id,
                    {comments: comments}
                ).success(function () {
                        console.log("successfully pushed comments to submission!");
                    });
            }
        };

        //Gets the abstract version that a comment originated on
        $scope.getOriginAbstract = function (submission , index) {
            var comments = submission.comments;
            var abstract = submission.abstract;
            if (submission._id != comments[index].origin) {
                $http.get('/api/submissions/' + comments[index].origin).success(function(submission) {
                    abstract = submission.abstract;
                    $scope.populateComments(abstract, index , comments);
                });
            } else {
                $scope.populateComments(abstract, index, comments, submission._id, submission );
            }
        };


        //Creates the details view of a comment using a modal
        $scope.populateComments = function(abstract, index , comments, id, submission){
            var start = comments[index].beginner;
            var end = comments[index].ender;
            var comment = comments[index].commentText;
            var details = "";
            abstract = abstract.substring(0, start) + '<b>' + abstract.substring(start, end) + '</b>' + abstract.substring(end, abstract.length);
            if(comments[index].origin != id){
                details = details + "<b>" + "This comment was made on a prior version of this submission" + "</b>" + "<br>";
            }
            if ($scope.hasAdminPrivs() || $scope.isReviewerGroup(submission)) {
                details = details + "<b>" +"Comment made by " + comments[index].commenter + ": " + "</b>";
            } else {
                details = details + "<b>" +"Comment: " + "</b>";
            }
            details = details + "<i>" + comments[index].commentText + "</i>" + "<br>" + comments[index].timestamp;
            if (start == 0 && end == 0) {
                Modal.confirm.details()(details);
            } else {
                details = details + "<br>" + abstract;
                Modal.confirm.details()(details);
            }
        };

        //Responses dropdown toggle
        $scope.showResponses = false;

        //Creates a response object and patches it to the comment in the database
        $scope.addResponse = function (submission, index){
            var comments = submission.comments;
            var comment = comments[index];
            var responseObj = {};
            var response = prompt("response");
            responseObj.response = response;
            responseObj.responder = $scope.getCurrentUser().name;
            responseObj.timestamp = Date();
            if(response != null && response != "") {
                comment.responses.push(responseObj);
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {comments: comments}
                ).success(function () {
                        console.log("successfully pushed response to submission!");
                    });
            }
        };

        //Calls the modal for the deleteComment function
        $scope.deleteCommentModal = function(submission, index){
            Modal.confirm.deleteComment($scope.deleteComment)("this comment and all of its responses",submission,index);
        };

        //Removes a comment from a submissions comment array and then patches it to the database
        $scope.deleteComment = function (submission, index){
            var comments = submission.comments;
                comments.splice(index, 1);
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {comments: comments}
                ).success(function(){
                        console.log("successfully deleted comments from a submission!");
                    });
        };

        //Creates a modal for the deleteResponses function
        $scope.deleteResponseModal = function(submission,parentIndex,childIndex) {
            Modal.confirm.deleteComment($scope.deleteResponse)("this response",submission,parentIndex,childIndex);
        };

        //Removes a response from a commentObj and then patches to the database
        $scope.deleteResponse = function (submission, parentIndex, childIndex){
            var comments = submission.comments;
                comments[parentIndex].responses.splice(childIndex, 1);
                $http.patch('api/submissions/' + $scope.selection.item._id,
                    {comments: comments}
                ).success(function(){
                        console.log("successfully deleted response from a comment to a submission!");
                    });
        };

    });
