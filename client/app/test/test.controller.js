'use strict';

angular.module('umm3601ursamajorApp')
  .controller('TestCtrl', function ($scope,$document,$http, $window) {


        $scope.textArea = "I love candy so bloody much";


//        console.log($document[0].getElementById('ta').selectionStart);
//        console.log( $document.prop( "body" ) );

        $scope.abstract = "I love candy so bloody much";

//        $scope.addComment = function(id){
//            var abstract = $document[0].getElementById(id);
//            var commentObj = {};
//            var comment = prompt('Comment Here');
//            var start = abstract.selectionStart;
//            var end = abstract.selectionEnd;
//            commentObj.comment = comment;
//            commentObj.start = start;
//            commentObj.end = end;
//            abstract.value = abstract.value.substring(0, start) + '<b>' + abstract.value.substring(start, end) + '</b>' + abstract.value.substring(end, abstract.value.length);
//            console.log(commentObj);
//            console.log(abstract.value);
//            $scope.abstract = abstract.value;
//        }
        $scope.addComment = function () {
            var selection = $window.getSelection();
            console.log(selection);
            var commentText = prompt("Comment");
        }

        });
