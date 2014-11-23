'use strict';

angular.module('umm3601ursamajorApp')

  .controller('SubformCtrl', function ($scope, $http, Auth, $location, socket, $filter, $window) {


    if(Auth.isLoggedIn() === false) {
        $location.path('/');
    }

    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.timestamp = Date();

    $scope.submissions = [];
    $scope.flaggedSubmissions = [];
    $scope.resubmitParent = null;

    $scope.updateFlaggedSubmissions = function(subs){
        $scope.flaggedSubmissions = $filter('filter')(subs, function(sub){return (sub.resubmissionData.resubmitFlag && (Auth.getCurrentUser().email === sub.presenterInfo.email))});
    };

    $http.get('/api/submissions').success(function(submissions) {
        $scope.submissions = submissions;
        $scope.updateFlaggedSubmissions(submissions);
        socket.syncUpdates('submission', $scope.submissions);
    });

    $scope.hasResubmitFlags = function(){
        return $scope.flaggedSubmissions.length > 0;
    };

    $scope.isResubmitting = false;

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
        status: {strict: "Revisions Needed", text: "Your URS submission has been flagged for revisions, and is in need of changes."},
        adviserInfo: {first: "", last: "", email: ""},
        featuredPresentation: Boolean,
        mediaServicesEquipment: "",
        specialRequirements: "",
        presenterTeeSize: "",
        otherInfo: "",
        resubmitComment: "",
        resubmitParent: "",
        resubmitFlag: false
    };

    //Email for advisors
    var sendGmail = function(opts){
        var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
            '&to=' + opts.to +
            '&su=' + opts.subject +
            '&body=' + opts.message +
            '&ui=1';
        $window.open(str);
    };

    $scope.getResubmitData = function(submission){
        var tempSponsors = [];
        var addedToggle = false;

        //fixed now (probably)
        for(var x = 0; x <= $scope.fundingSources.length; x++){
            addedToggle = false;
//            console.log("Main for loop, sponsor: " + $scope.fundingSources[x]);
//            console.log("Length of sponsors from submission: " + submission.sponsors.length);
//            console.log("X: " + x);
            for(var y = 0; y < submission.sponsors.length; y++){
//                console.log("final case? " + (x == $scope.fundingSources.length));
                if(x == $scope.fundingSources.length){
                    if(submission.sponsors[submission.sponsors.length - 1] != $scope.fundingSources[x -1]){
                        tempSponsors.push(submission.sponsors[submission.sponsors.length - 1]);
                    }
                    break;
                } else if(submission.sponsors[y] === $scope.fundingSources[x]){
                    tempSponsors.push(submission.sponsors[y]);
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
        console.log("~~~~~~~~~~~~~~sponsors from parent submission~~~~~~~~~~~~~~~~~~");
        console.log(tempSponsors);

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
            sponsors: tempSponsors,
            sponsorsFinal: [],
            adviserInfo: {first: submission.adviserInfo.first, last: submission.adviserInfo.last, email: submission.adviserInfo.email},
            featuredPresentation: submission.featured,
            mediaServicesEquipment: submission.mediaServicesEquipment,
            specialRequirements: submission.specialRequirements,
            presenterTeeSize: submission.presenterTeeSize,
            otherInfo: submission.otherInfo,
            resubmitComment: "",
            resubmitParent: submission._id,
            resubmitFlag: false
        };

        $scope.isResubmitting = true;
        $scope.resubmitParent = submission;
    };

    $scope.submissionTextArray = [];

    $scope.submissionText = {};

    $http.get('/api/subformtexts').success(function(submissionTextArray) {
        $scope.submissionTextArray = submissionTextArray;
        $scope.submissionText = $scope.submissionTextArray[0];
    });

    $scope.checkEmailsAreMorris = function (){
        var presenterEmail = $scope.submissionData.presenterInfo.email;
        var copresenterOneEmail = $scope.submissionData.copresenterOne.email;
        var copresenterTwoEmail = $scope.submissionData.copresenterTwo.email;

        var presenterCheck = (presenterEmail.indexOf("morris.umn.edu") != -1);

        if(copresenterOneEmail != ""){
            var copresenterOneCheck = (copresenterOneEmail.indexOf("morris.umn.edu") != -1);
        } else{
            var copresenterOneCheck = true;
        }

        if(copresenterTwoEmail != ""){
            var copresenterTwoCheck = (copresenterTwoEmail.indexOf("morris.umn.edu") != -1);
        } else{
            var copresenterTwoCheck = true;
        }

        return presenterCheck && copresenterOneCheck && copresenterTwoCheck;
    };

    $scope.submitSubmission = function(){
        if($scope.checkEmailsAreMorris() === true) {
            var r = confirm("Are you sure you want to submit?");
            if (r) {
                for (var i = 0; i < $scope.submissionData.sponsors.length; i++) {
                    if ($scope.submissionData.sponsors[i] != "" && $scope.submissionData.sponsors[i] != null) {
                        $scope.submissionData.sponsorsFinal.push($scope.submissionData.sponsors[i]);
                    }
                }
                console.log('posting Data!');
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
                        featured: $scope.submissionData.featuredPresentation,
                        mediaServicesEquipment: $scope.submissionData.mediaServicesEquipment,
                        specialRequirements: $scope.submissionData.specialRequirements,
                        presenterTeeSize: $scope.submissionData.presenterTeeSize,
                        otherInfo: $scope.submissionData.otherInfo,
                        approval: false,
                        status: {strict: "Awaiting Adviser Approval", text: "Adviser has not been notified"},
                        timestamp: $scope.timestamp,
                        group: 0,
                        resubmissionData: {comment: $scope.submissionData.resubmitComment, parentSubmission: $scope.submissionData.resubmitParent, isPrimary: !$scope.isResubmitting, resubmitFlag: $scope.submissionData.resubmitFlag },
                        comments: []
                    });
            };

            if (r && !$scope.isResubmitting) {
                alert("Please send the email that is about to be generated.");
                sendGmail({
                    to: $scope.submissionData.adviserInfo.email,
                    subject: 'URS Submission requires approval',
                    message: $scope.submissionData.presenterInfo.first + " " + $scope.submissionData.presenterInfo.last +
                        ' has submitted a URS submission that requires your approval. Please go to https://ursa-major.herokuapp.com/ to log in and approve the submission.'
                });
            }
            if ($scope.isResubmitting && r) {
                $http.patch('api/submissions/' + $scope.submissionData.resubmitParent,
                    // This is only setting false right now. comment and submission donot get stored.
                    {resubmissionData: {comment: $scope.resubmitParent.resubmissionData.comment, parentSubmission: $scope.resubmitParent.resubmissionData.parentSubmission, resubmitFlag: false, isPrimary: true}}
                ).success(function () {
                        console.log("Successfully unflagged the original submission for resbumission.");
                    });
            }
            if (r) {
                $scope.resetData();
                $location.path('/submissionpage');
            }
        } else{
            $window.alert("One of the emails you entered is not a UMN Morris email.");
        }
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
            featuredPresentation: Boolean,
            mediaServicesEquipment: "",
            specialRequirements: "",
            presenterTeeSize: "",
            otherInfo: ""
        };
    };

  });
