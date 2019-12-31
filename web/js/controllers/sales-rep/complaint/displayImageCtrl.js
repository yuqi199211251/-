/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('displayImageCtrl',['$scope','$rootScope','feedbackPhotosList',
	function($scope,$rootScope,feedbackPhotosList){
        $scope.feedbackPhotosList = feedbackPhotosList;

    }])
    /* .controller('adminCtrl',['$scope','$rootScope','$interval','$modal','feedbackPhotosList','utilSvc','jmService',
	function($scope,$rootScope,$interval,$modal,feedbackPhotosList,utilSvc,apiSvc){


    }]) */
 }());
