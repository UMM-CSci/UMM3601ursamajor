'use strict';

angular.module('umm3601ursamajorApp')

    .controller('SubformCtrl', function ($scope, $http, Auth, $location, socket, $filter, $window, Modal) {


        if(Auth.isLoggedIn() === false) {
            $location.path('/');
        }

        // Authentication Stuff
        $scope.isAdmin = Auth.isAdmin;
        $scope.isLoggedIn = Auth.isLoggedIn;

        // Status Stuff
        $scope.statusArray = [];
        $scope.startingStatus = "";

        // Text Content for the Form
        $scope.submissionTextArray = [];
        $scope.submissionText = {};

        // Resubmission Stuff
        $scope.submissions = [];
        $scope.flaggedSubmissions = [];
        $scope.resubmitParent = null;
        $scope.isResubmitting = false;

        // Misc. Stuff
        $scope.timestamp = Date();

        // Admin / Testing Specific Stuff
        $scope.attemptEmail = true; //Used to prevent the attempted sending of emails during testing.
        $scope.attemptRedirect = true; //Used to prevent attempted redirecting during testing.


        // ---------------------------------------- General HTTP requests ----------------------------------------
        $http.get('/api/submissions').success(function(submissions) {
            $scope.submissions = submissions;
            $scope.updateFlaggedSubmissions(submissions);
            socket.syncUpdates('submission', $scope.submissions);
        });

        $http.get('/api/statuss').success(function(statusArray) {
            $scope.statusArray = statusArray;
            for(var i = 0; i < $scope.statusArray.length; i++) {
                if ($scope.statusArray[i].priority == -15) {
                    $scope.startingStatus = $scope.statusArray[i].strict;
                    $scope.submissionData.status = {strict: $scope.startingStatus, priority: -15, text: ""};
                }
            }
        });

        $http.get('/api/subformtexts').success(function(submissionTextArray) {
            $scope.submissionTextArray = submissionTextArray;
            $scope.submissionText = $scope.submissionTextArray[0];
        });

        // --------------------------------------- Data maintenance functions ------------------------------------

        /**
         * Updates $scope.flaggedSubmissions with any submissions owned by the user that have active resubmit flags.
         *
         * @param subs  - Array of submissions to update from. (usually $scope.submissions)
         */
        $scope.updateFlaggedSubmissions = function(subs){
            $scope.flaggedSubmissions = $filter('filter')(subs, function(sub){return (sub.resubmissionData.resubmitFlag && (Auth.getCurrentUser().email === sub.presenterInfo.email))});
        };

        /**
         * Checks if the user has any submissions with active resubmit flags.
         *
         * @returns {boolean}  - Whether the user has any active resubmit flags.
         */
        $scope.hasResubmitFlags = function(){
            return $scope.flaggedSubmissions.length > 0;
        };

        // --------------------------------------- Default data for View ------------------------------------------

        $scope.formatOptions =
            ['Artist Statement',
                'Humanities Proposal',
                'Science or Social Science Abstract'
            ];

        $scope.presentationTypes =
            ['Poster or visual display',
                'Oral presentation',
                'Performance'
            ];

        $scope.fundingSources = [
            'UROP',
            'MAP',
            'MMP',
            'LSAMP'
        ];

        $scope.numberOfSources = $scope.fundingSources.length;

//        $scope.teeSizes = [
//            'S',
//            'M',
//            'L',
//            'XL',
//            'XXL',
//            'XXXL'
//        ];

        $scope.submissionData = {
            title: "",
            format: "",
            abstract: "",
            presentationType: "",
            formatChange: Boolean,
            presenterInfo: {first: "", last: "", email: ""},
            copresenterOne: {first: "", last: "", email: ""},
            copresenterTwo: {first: "", last: "", email: ""},
            discipline: "",
            sponsors: [],
            sponsorsFinal: [],
            adviserInfo: {first: "", last: "", email: ""},
            coadviserOneInfo: {first: "", last: "", email: ""},
            coadviserTwoInfo: {first: "", last: "", email: ""},
            featuredPresentation: Boolean,
            mediaServicesEquipment: "",
            specialRequirements: "",
//            presenterTeeSize: "",
            otherInfo: "",
            approval: false,
            resubmitComment: "",
            resubmitParent: "",
            resubmitFlag: false,
            status: {strict: $scope.startingStatus, priority: -15, text: ""},
            comments: [],
            group: 0,
            roomAssignment: "",
            reviewVotes: {
                Accepted: [],
                Minor: [],
                Major: [],
                TotalRewrite: []
            }
        };

        // ----------------------------- Misc Helper Functions --------------------------------------

        /**
         * Opens a new email (gmail) in a new tab using parameters specified in opts.
         *
         * @param opts  - Options for the generated email:
         *
         * to: Array of emails to send to.
         * subject: Subject of email.
         * message: Body of email.
         */
        var sendGmail = function(opts){
            var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
                '&to=' + opts.to +
                '&su=' + opts.subject +
                '&body=' + opts.message +
                '&ui=1';
            $window.open(str);
        };

        /**
         * Returns the number of chatacters the user has left for their abstract.
         *
         * @returns {number}  - The number of remaining characters (out of 1000).
         */
        $scope.charsRemaining = function() {
            return 1000 - $scope.submissionData.abstract.length;
        };

        /**
         * Resets the submissionData to its default values.
         */
        $scope.resetData = function(){
            $scope.submissionData = {
                title: "",
                format: "",
                abstract: "",
                presentationType: "",
                formatChange: Boolean,
                presenterInfo: {first: "", last: "", email: ""},
                copresenterOne: {first: "", last: "", email: ""},
                copresenterTwo: {first: "", last: "", email: ""},
                discipline: "",
                sponsors: [],
                sponsorsFinal: [],
                adviserInfo: {first: "", last: "", email: ""},
                coadviserOneInfo: {first: "", last: "", email: ""},
                coadviserTwoInfo: {first: "", last: "", email: ""},
                featuredPresentation: Boolean,
                mediaServicesEquipment: "",
                specialRequirements: "",
//                presenterTeeSize: "",
                otherInfo: "",
                approval: false,
                resubmitComment: "",
                resubmitParent: "",
                resubmitFlag: false,
                status: {strict: $scope.startingStatus, priority: -15, text: ""},
                comments: [],
                group: 0,
                roomAssignment: "",
                reviewVotes: {
                    Accepted: [],
                    Minor: [],
                    Major: [],
                    TotalRewrite: []
                }
            };
        };

        /**
         * Sends a canned email to the advisers of the submission. (if attemptEmail is true).
         */
        $scope.sendAdviserEmail = function() {
            if($scope.attemptEmail){
                sendGmail({
                    to: [$scope.submissionData.adviserInfo.email, $scope.submissionData.coadviserOneInfo.email, $scope.submissionData.coadviserTwoInfo.email],
                    subject: 'URS Submission requires approval',
                    message: $scope.submissionData.presenterInfo.first + " " + $scope.submissionData.presenterInfo.last +
                        ' has submitted a URS submission that requires your approval. ' +
                        'By approving the submission, you are authorizing the student(s) to submit this abstract for consideration for the URS, ' +
                        'not approving the final abstract; the student(s) will have the opportunity to further revise, improve, and finalize their submission. '+
                        'Please go to https://ursa-major.herokuapp.com/ to log in and approve (or reject) the submission.'
                });
            }
        };

        //----------------------------------- Resubmission Functions --------------------------------------

        /**
         * Converts array of sponsors from a submission into a format suitable for the submission form.
         *
         * @param arry  - the array to be converted. IE: ["UROP", "MMP"]
         * @returns {Array}  - the array which is suitable for use in the submission form. IE: ["UROP", "",  "MMP", ""]
         */
        $scope.convertSponsorArray = function(arry) {
            var tempSponsors = [];
            var addedToggle = false;

            for(var x = 0; x <= $scope.fundingSources.length; x++){
                addedToggle = false;
                for(var y = 0; y < arry.length; y++){
                    if(x == $scope.fundingSources.length){
                        if($scope.fundingSources.indexOf(arry[arry.length - 1]) == -1){
                            tempSponsors.push(arry[arry.length - 1]);
                        }
                        break;
                    } else if(arry[y] === $scope.fundingSources[x]){
                        tempSponsors.push(arry[y]);
                        addedToggle = true;
                    }
                }
                if(!addedToggle){
                    if(x == $scope.fundingSources.length){
                        addedToggle = !addedToggle;
                    } else {
                        tempSponsors.push("");
                        addedToggle = !addedToggle;
                    }
                }
            }
//        console.log("~~~~~~~~~~~~~~sponsors from parent submission~~~~~~~~~~~~~~~~~~");
//        console.log(tempSponsors);
            return tempSponsors;
        };

        /**
         * Checks for changes to primary adviser during a resubmission.
         *
         * If any aspect of the primary adviser has changed from the parent submission, the user will be prompted to send an email to the new adviser.
         */
        $scope.checkAdviserChanges = function(){
            var same = true;
            if($scope.isResubmitting){
                for(var key in $scope.submissionData.adviserInfo){
                    if($scope.submissionData.adviserInfo.hasOwnProperty(key)){
                        if($scope.submissionData.adviserInfo[key] != $scope.resubmitParent.adviserInfo[key]){
                            console.log("Adviser difference!");
                            console.log($scope.submissionData.adviserInfo[key] + " | " + $scope.resubmitParent.adviserInfo[key]);
                            same = false;
                            break;
                        }
                    }
                }

                if(!same){
                    $scope.submissionData.approval = false;
                    Modal.confirm.info($scope.sendAdviserEmail)("You have changed your primary adviser from " + $scope.resubmitParent.adviserInfo.last + ", " + $scope.resubmitParent.adviserInfo.first + " [" + $scope.resubmitParent.adviserInfo.email + "] to " +
                       $scope.submissionData.adviserInfo.last + ", " + $scope.submissionData.adviserInfo.first + " [" + $scope.submissionData.adviserInfo.email + "]. " + " Your submission will now require the approval of this new adviser. Send email to new adviser?");
                }
            }
        };

        /**
         * Gathers relevant data from the parent submission for resubmission.
         *
         * @param submission  - The parent submission.
         */
        $scope.getResubmitData = function(submission){
            $scope.submissionData = {
                title: submission.title,
                format: submission.format,
                abstract: submission.abstract,
                presentationType: submission.presentationType,
                formatChange: submission.formatChange,
                presenterInfo: {first: submission.presenterInfo.first, last: submission.presenterInfo.last, email: submission.presenterInfo.email},
                copresenterOne: {first: submission.copresenterOneInfo.first, last: submission.copresenterOneInfo.last, email: submission.copresenterOneInfo.email},
                copresenterTwo: {first: submission.copresenterTwoInfo.first, last: submission.copresenterTwoInfo.last, email: submission.copresenterTwoInfo.email},
                discipline: submission.discipline,
                sponsors: $scope.convertSponsorArray(submission.sponsors),
                sponsorsFinal: [],
                adviserInfo: {first: submission.adviserInfo.first, last: submission.adviserInfo.last, email: submission.adviserInfo.email},
                coadviserOneInfo: {first: submission.coadviserOneInfo.first, last: submission.coadviserOneInfo.last, email: submission.coadviserOneInfo.email},
                coadviserTwoInfo: {first: submission.coadviserTwoInfo.first, last: submission.coadviserTwoInfo.last, email: submission.coadviserTwoInfo.email},
                featuredPresentation: submission.featured,
                mediaServicesEquipment: submission.mediaServicesEquipment,
                specialRequirements: submission.specialRequirements,
//                presenterTeeSize: submission.presenterTeeSize,
                otherInfo: submission.otherInfo,
                approval: submission.approval,
                resubmitComment: "",
                resubmitParent: submission._id,
                resubmitFlag: false,
                status: submission.status,
                comments: submission.comments,
                group: submission.group,
                roomAssignment: submission.roomAssignment,
                reviewVotes: {
                    Accepted: submission.reviewVotes.Accepted,
                    Minor: submission.reviewVotes.Minor,
                    Major: submission.reviewVotes.Major,
                    TotalRewrite: submission.reviewVotes.TotalRewrite
                }
            };
//            console.log("submissionData: ");
//            console.log($scope.submissionData);
//            console.log(submission.comments);

            $scope.isResubmitting = true;
            $scope.resubmitParent = submission;
        };

        //--------------------------- Email Validation -------------------------------

        /**
         * Checks if emails in the submission data are U of M addresses. (not specifically morris).
         *
         * @returns {boolean}  - Whether or not all emails are U of M addresses.
         */
        $scope.checkEmailsAreUofM = function (){
            var presenterEmail = $scope.submissionData.presenterInfo.email;
            var copresenterOneEmail = $scope.submissionData.copresenterOne.email;
            var copresenterTwoEmail = $scope.submissionData.copresenterTwo.email;
            var adviserEmail = $scope.submissionData.adviserInfo.email;
            var coadviserOneEmail = $scope.submissionData.coadviserOneInfo.email;
            var coadviserTwoEmail = $scope.submissionData.coadviserTwoInfo.email;

            var copresenterOneCheck = true;
            var copresenterTwoCheck = true;
            var coadviserOneCheck = true;
            var coadviserTwoCheck = true;

            var presenterCheck = (presenterEmail.indexOf("umn.edu") != -1);

            if(copresenterOneEmail != ""){
                copresenterOneCheck = (copresenterOneEmail.indexOf("umn.edu") != -1);
            }

            if(copresenterTwoEmail != ""){
                copresenterTwoCheck = (copresenterTwoEmail.indexOf("umn.edu") != -1);
            }

            var adviserEmailCheck = (adviserEmail.indexOf("umn.edu") != -1);

            if(coadviserOneEmail != ""){
                coadviserOneCheck = (coadviserOneEmail.indexOf("umn.edu") != -1);
            }

            if(coadviserTwoEmail != ""){
                coadviserTwoCheck = (coadviserTwoEmail.indexOf("umn.edu") != -1);
            }

            return presenterCheck && copresenterOneCheck &&
                copresenterTwoCheck && adviserEmailCheck
                && coadviserOneCheck && coadviserTwoCheck;
        };

        /**
         * Checks if all emails in submission data are U of M Morris addresses.
         *
         * @returns {boolean}  - Whether or not all emails are U of M Morris addresses.
         */
        $scope.checkEmailsAreMorris = function (){
            var presenterEmail = $scope.submissionData.presenterInfo.email;
            var copresenterOneEmail = $scope.submissionData.copresenterOne.email;
            var copresenterTwoEmail = $scope.submissionData.copresenterTwo.email;
            var adviserEmail = $scope.submissionData.adviserInfo.email;
            var coadviserOneEmail = $scope.submissionData.coadviserOneInfo.email;
            var coadviserTwoEmail = $scope.submissionData.coadviserTwoInfo.email;

            var copresenterOneCheck = true;
            var copresenterTwoCheck = true;
            var coadviserOneCheck = true;
            var coadviserTwoCheck = true;

            var presenterCheck = (presenterEmail.indexOf("morris.umn.edu") != -1);

            if(copresenterOneEmail != ""){
                copresenterOneCheck = (copresenterOneEmail.indexOf("morris.umn.edu") != -1);
            }

            if(copresenterTwoEmail != ""){
                copresenterTwoCheck = (copresenterTwoEmail.indexOf("morris.umn.edu") != -1);
            }

            var adviserEmailCheck = (adviserEmail.indexOf("morris.umn.edu") != -1);

            if(coadviserOneEmail != ""){
                coadviserOneCheck = (coadviserOneEmail.indexOf("morris.umn.edu") != -1);
            }

            if(coadviserTwoEmail != ""){
                coadviserTwoCheck = (coadviserTwoEmail.indexOf("morris.umn.edu") != -1);
            }

            return presenterCheck && copresenterOneCheck &&
                copresenterTwoCheck && adviserEmailCheck
                && coadviserOneCheck && coadviserTwoCheck;
        };

        //must check that primary adviser is Morris, but all others can be just umn, because primary must log in with Morris email
        $scope.checkPrimaryEmails = function(){
            var presenterEmail = $scope.submissionData.presenterInfo.email;
            var adviserEmail = $scope.submissionData.adviserInfo.email;

            var presenterEmailCheck = (presenterEmail.indexOf("morris.umn.edu") != -1);
            var adviserEmailCheck = (adviserEmail.indexOf("morris.umn.edu") != -1);

            return presenterEmailCheck && adviserEmailCheck;
        };

        /**
         * Runs email validation (above) and alerts the user if necessary.
         *
         * If validation passes, submission process will begin.
         */
        $scope.preSubmitChecks = function(){
            var checkUMM = $scope.checkEmailsAreMorris();

            // If all emails are UMM, proceed with submission
            if(checkUMM){
                $scope.submitSubmissionConfirm();
            } else {
                var checkPrimary = $scope.checkPrimaryEmails();
                var checkUofM = $scope.checkEmailsAreUofM();

                if(!checkPrimary){
                    Modal.confirm.warning()("Either your main presenter email or primary adviser email is not currently a U of M Morris email.");
                } else if(!checkUofM){
                    Modal.confirm.warning()("One of the emails you entered is not a University of Minnesota email.");
                } else if (checkUofM && !checkUMM){
                    Modal.confirm.info($scope.submitSubmissionConfirm)("At least one of the emails you entered is not a Morris email address. Would you like to continue?");
                }
            }
        };

        //---------------------------- Submitting Submission(s) ------------------------------

        /**
         * Opens confirmation modal (info) to confirm the user's desire to submit their submission.
         */
        $scope.submitSubmissionConfirm = function(){
            Modal.confirm.info($scope.submitSubmission)("Are you sure you want to submit?");
        };

        /**
         * Does a variety of things in order to submit a submission to the database.
         */
        $scope.submitSubmission = function(){

            // checking for changes to primary adviser.
            $scope.checkAdviserChanges();

            // Converts the submissionData sponsors array into a readable format for storage as part of the submission.
            for (var i = 0; i < $scope.submissionData.sponsors.length; i++) {
                if ($scope.submissionData.sponsors[i] != "" && $scope.submissionData.sponsors[i] != null) {
                    $scope.submissionData.sponsorsFinal.push($scope.submissionData.sponsors[i]);
                }
            }

            // If the user is NOT resubmitting, sets the status to the default submission status (lowest priority #?)
            //if(!$scope.isResubmitting){
            //    $scope.submissionData.status = {strict: $scope.startingStatus, text: ""};
            //    //updating status to ensure that it works....?
            //}

            // if the user IS resubmitting, transfers the comments from the parent submission into submissionData for inclusion in the resubmission.
            if($scope.isResubmitting){
                console.log("saving comments from original submission");
                console.log("original comments: " + $scope.resubmitParent.comments);
                $scope.submissionData.comments = $scope.resubmitParent.comments;
                console.log($scope.submissionData.comments);
            }

            $http.post('/api/submissions/',
                {   title: $scope.submissionData.title,
                    format: $scope.submissionData.format,
                    abstract: $scope.submissionData.abstract,
                    presentationType: $scope.submissionData.presentationType,
                    formatChange: $scope.submissionData.formatChange,
                    presenterInfo: {first: $scope.submissionData.presenterInfo.first, last: $scope.submissionData.presenterInfo.last, email: $scope.submissionData.presenterInfo.email},
                    copresenterOneInfo: {first: $scope.submissionData.copresenterOne.first, last: $scope.submissionData.copresenterOne.last, email: $scope.submissionData.copresenterOne.email},
                    copresenterTwoInfo: {first: $scope.submissionData.copresenterTwo.first, last: $scope.submissionData.copresenterTwo.last, email: $scope.submissionData.copresenterTwo.email},
                    discipline: $scope.submissionData.discipline,
                    sponsors: $scope.submissionData.sponsorsFinal,
                    adviserInfo: {first: $scope.submissionData.adviserInfo.first, last: $scope.submissionData.adviserInfo.last, email: $scope.submissionData.adviserInfo.email},
                    coadviserOneInfo: {first: $scope.submissionData.coadviserOneInfo.first, last: $scope.submissionData.coadviserOneInfo.last, email: $scope.submissionData.coadviserOneInfo.email},
                    coadviserTwoInfo: {first: $scope.submissionData.coadviserTwoInfo.first, last: $scope.submissionData.coadviserTwoInfo.last, email: $scope.submissionData.coadviserTwoInfo.email},
                    featured: $scope.submissionData.featuredPresentation,
                    mediaServicesEquipment: $scope.submissionData.mediaServicesEquipment,
                    specialRequirements: $scope.submissionData.specialRequirements,
//                    presenterTeeSize: $scope.submissionData.presenterTeeSize,
                    otherInfo: $scope.submissionData.otherInfo,
                    approval: $scope.submissionData.approval,
                    cc: false,
                    rejection: false,
                    status: $scope.submissionData.status,
                    timestamp: $scope.timestamp,
                    group: $scope.submissionData.group,
                    roomAssignment: $scope.submissionData.roomAssignment,
                    resubmissionData: {comment: $scope.submissionData.resubmitComment, parentSubmission: $scope.submissionData.resubmitParent, isPrimary: !$scope.isResubmitting, resubmitFlag: $scope.submissionData.resubmitFlag },
                    comments: $scope.submissionData.comments,
                    reviewVotes: {
                        Accepted: $scope.submissionData.reviewVotes.Accepted,
                        Minor: $scope.submissionData.reviewVotes.Minor,
                        Major: $scope.submissionData.reviewVotes.Major,
                        TotalRewrite: $scope.submissionData.reviewVotes.TotalRewrite
                    }
                });

            // Alter resubmissionData of parent submission to reflect the fact that a resubmission has been made.
            if ($scope.isResubmitting) {
                $http.patch('api/submissions/' + $scope.submissionData.resubmitParent,
                    {
                        resubmissionData: {comment: $scope.resubmitParent.resubmissionData.comment, parentSubmission: $scope.resubmitParent.resubmissionData.parentSubmission, resubmitFlag: false, isPrimary: true}
                    }
                ).success(function () {
                        console.log("Successfully unflagged the original submission for resbumission.");
                    });
            }

            // Default attempt to send adviser email if submission is not a resubmission.
            if(!$scope.isResubmitting && $scope.attemptEmail){
                Modal.confirm.warning($scope.sendSpecialAdviserEmail)("If you do not send the email that will be automatically generated, your adviser will not receive a notification to approve your submission.");
            };

        };

        $scope.resetAndRedirect = function(){
                $scope.resetData();
                console.log('reseting data');
            if($scope.attemptRedirect){
                $location.path('/submissionpage');
                console.log('redirecting');
            };
        };

        $scope.sendSpecialAdviserEmail = function(){
            $scope.sendAdviserEmail();
            $scope.resetAndRedirect();
        };

        /**
         * Helper function for adminAutoSubmit.
         *
         * @returns {number}  -random number that serves as a valid index in $scope.submissions
         */
        $scope.randomSubmissionIndex = function(){
            return Math.floor(($scope.submissions.length - 1) * Math.random());;
        };

        /**
         * Selects a random submission from the existing submissions in the database and submits it as a new submission. (n times)
         * Used to test system performance with large numbers of submissions.
         *
         * @param n  - The number of random submissions to make.
         */
        $scope.adminAutoSubmit = function(n){
            if(n > 1){$scope.attemptRedirect = false;}
            for(var i=0; i<=n; i++){
                $scope.getResubmitData($scope.submissions[$scope.randomSubmissionIndex()]);

                $scope.submissionData.resubmitFlag = false;

                $scope.isResubmitting = false;

                $scope.submissionData.title = $scope.submissionData.title + " [FILLER SUBMISSION]";

                $scope.attemptEmail = false;

                console.log("auto submitting admin auto generated submission!");

                $scope.submitSubmission();
            }
        }

    });
