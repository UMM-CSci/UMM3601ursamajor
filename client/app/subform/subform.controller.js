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
        $scope.attemptEmail = true;
        $scope.attemptRedirect = true;


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
                    $scope.submissionData.status = {strict: $scope.startingStatus, text: ""};
                }
            }
        });

        $http.get('/api/subformtexts').success(function(submissionTextArray) {
            $scope.submissionTextArray = submissionTextArray;
            $scope.submissionText = $scope.submissionTextArray[0];
        });

        // --------------------------------------- Data maintenance functions ------------------------------------

        // Updates the local array with flagged submissions owned by the current user.
        $scope.updateFlaggedSubmissions = function(subs){
            $scope.flaggedSubmissions = $filter('filter')(subs, function(sub){return (sub.resubmissionData.resubmitFlag && (Auth.getCurrentUser().email === sub.presenterInfo.email))});
        };

        // Returns true if the user has flagged submissions, false otherwise.
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

        $scope.teeSizes = [
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            'XXXL'
        ];



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
            //presenterTeeSize: "",
            otherInfo: "",
            approval: false,
            resubmitComment: "",
            resubmitParent: "",
            resubmitFlag: false,
            status: {strict: $scope.startingStatus, text: ""},
            comments: [],
            group: 0,
            reviewVotes: {
                Accepted: [],
                Minor: [],
                Major: [],
                TotalRewrite: []
            }
        };

        // ----------------------------- Misc Helper Functions --------------------------------------

        //Email for advisers
        var sendGmail = function(opts){
            var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
                '&to=' + opts.to +
                '&su=' + opts.subject +
                '&body=' + opts.message +
                '&ui=1';
            $window.open(str);
        };

        $scope.charsRemaining = function() {
            return 1000 - $scope.submissionData.abstract.length;
        };

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
                sponsors: ["","","","",""], //Might need to worry about if this is static for the DB later.
                adviserInfo: {first: "", last: "", email: ""},
                coadviserOneInfo: {first: "", last: "", email: ""},
                coadviserTwoInfo: {first: "", last: "", email: ""},
                featuredPresentation: Boolean,
                mediaServicesEquipment: "",
                specialRequirements: "",
                presenterTeeSize: "",
                otherInfo: ""
            };
        };

        $scope.sendAdviserEmail = function() {
            sendGmail({
                to: [$scope.submissionData.adviserInfo.email, $scope.submissionData.coadviserOneInfo.email, $scope.submissionData.coadviserTwoInfo.email],
                subject: 'URS Submission requires approval',
                message: $scope.submissionData.presenterInfo.first + " " + $scope.submissionData.presenterInfo.last +
                    ' has submitted a URS submission that requires your approval. ' +
                    'By approving the submission, you are authorizing the student(s) to submit this abstract for consideration for the URS, ' +
                    'not approving the final abstract; the student(s) will have the opportunity to further revise, improve, and finalize their submission. '+
                    'Please go to https://ursa-major.herokuapp.com/ to log in and approve (or reject) the submission.'
            });
        };

        //----------------------------------- Resubmission Functions --------------------------------------

        $scope.convertSponsorArray = function(arry) {
            var tempSponsors = [];
            var addedToggle = false;

            //fixed now (probably)
            for(var x = 0; x <= $scope.fundingSources.length; x++){
                addedToggle = false;
//            console.log("Main for loop, sponsor: " + $scope.fundingSources[x]);
//            console.log("Length of sponsors from submission: " + submission.sponsors.length);
//            console.log("X: " + x);
                for(var y = 0; y < arry.length; y++){
//                console.log("final case? " + (x == $scope.fundingSources.length));
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
//                console.log("Added toggle false!");
                    if(x == $scope.fundingSources.length){
                        addedToggle = !addedToggle;
                    } else {
                        tempSponsors.push("");
                        addedToggle = !addedToggle;
                    }
                }
//            console.log(tempSponsors);
            }
//        console.log("~~~~~~~~~~~~~~sponsors from parent submission~~~~~~~~~~~~~~~~~~");
//        console.log(tempSponsors);
            return tempSponsors;
        };

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
                //presenterTeeSize: submission.presenterTeeSize,
                otherInfo: submission.otherInfo,
                approval: submission.approval,
                resubmitComment: "",
                resubmitParent: submission._id,
                resubmitFlag: false,
                status: submission.status,
                comments: submission.comments,
                group: submission.group,
                reviewVotes: {
                    Accepted: submission.reviewVotes.Accepted,
                    Minor: submission.reviewVotes.Minor,
                    Major: submission.reviewVotes.Major,
                    TotalRewrite: submission.reviewVotes.TotalRewrite
                }
            };
            console.log("submissionData: ");
            console.log($scope.submissionData);
            console.log(submission.comments);

            $scope.isResubmitting = true;
            $scope.resubmitParent = submission;
        };

        //--------------------------- Email Validation -------------------------------

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

        $scope.preSubmitChecks = function(){
            if ($scope.checkEmailsAreUofM() === true && $scope.checkEmailsAreMorris() === false){
                var confirm = $window.confirm("At least one of the emails you entered is not a Morris email address. Would you like to continue?");
            } else if($scope.checkEmailsAreUofM() === false){
                $window.alert("One of the emails you entered is not a University of Minnesota email.");
            }

            if(confirm || $scope.checkEmailsAreMorris() === true){
                $scope.submitSubmissionConfirm();
            }
        };

        //---------------------------- Submitting Submission(s) ------------------------------


        $scope.submitSubmissionConfirm = function(){
            Modal.confirm.info($scope.submitSubmission)("Are you sure you want to submit?");
        };

        $scope.submitSubmission = function(){
            $scope.checkAdviserChanges();

            if(!$scope.isResubmitting && $scope.attemptEmail){
                alert("If you do not send the email that will be automatically generated, your adviser will not receive a notification to approve your submission.");
            }

            for (var i = 0; i < $scope.submissionData.sponsors.length; i++) {
                if ($scope.submissionData.sponsors[i] != "" && $scope.submissionData.sponsors[i] != null) {
                    $scope.submissionData.sponsorsFinal.push($scope.submissionData.sponsors[i]);
                }
            }

            if(!$scope.isResubmitting){
                $scope.submissionData.status = {strict: $scope.startingStatus, text: ""};
                //updating status to ensure that it works....?
            }
            if($scope.isResubmitting){
                console.log("saving comments from original submission");
                console.log("original comments: " + $scope.resubmitParent.comments);
                $scope.submissionData.comments = $scope.resubmitParent.comments;
                console.log($scope.submissionData.comments);
            }
//            console.log('posting Data!');
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
                    //presenterTeeSize: $scope.submissionData.presenterTeeSize,
                    otherInfo: $scope.submissionData.otherInfo,
                    approval: $scope.submissionData.approval,
                    cc: false,
                    rejection: false,
                    status: $scope.submissionData.status,
                    timestamp: $scope.timestamp,
                    group: $scope.submissionData.group,
                    resubmissionData: {comment: $scope.submissionData.resubmitComment, parentSubmission: $scope.submissionData.resubmitParent, isPrimary: !$scope.isResubmitting, resubmitFlag: $scope.submissionData.resubmitFlag },
                    comments: $scope.submissionData.comments,
                    reviewVotes: {
                        Accepted: $scope.submissionData.reviewVotes.Accepted,
                        Minor: $scope.submissionData.reviewVotes.Minor,
                        Major: $scope.submissionData.reviewVotes.Major,
                        TotalRewrite: $scope.submissionData.reviewVotes.TotalRewrite
                    }
                });


            if (!$scope.isResubmitting && $scope.attemptEmail) {
               $scope.sendAdviserEmail();
            }
            if ($scope.isResubmitting) {
                $http.patch('api/submissions/' + $scope.submissionData.resubmitParent,
                    {
                        resubmissionData: {comment: $scope.resubmitParent.resubmissionData.comment, parentSubmission: $scope.resubmitParent.resubmissionData.parentSubmission, resubmitFlag: false, isPrimary: true}
                    }
                ).success(function () {
                        console.log("Successfully unflagged the original submission for resbumission.");
                    });
            }
            $scope.resetData();
            if($scope.attemptRedirect){
                $location.path('/submissionpage');
            }
        };

        $scope.randomSubmissionIndex = function(){
            var i = Math.floor(($scope.submissions.length - 1) * Math.random());
            console.log("random index: " + i);
            return i;
        };

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
