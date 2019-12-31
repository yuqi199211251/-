/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('obElectronicSignatureInfoCtrl',['$scope','$rootScope','$location','$modal','utilSvc','jmService','constants','electronicSignature',
	function($scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants,electronicSignature){
        apiSvc.getElectronicSignaturePic({electronicSignature:electronicSignature}).$promise.then(function(data){
            $scope.picUrl = data[0][0].FData;
        },function(err){
            utilSvc.pageLoading("stop");
        })

        $scope.print = function(){
            print();
        }
    }])
 }());
