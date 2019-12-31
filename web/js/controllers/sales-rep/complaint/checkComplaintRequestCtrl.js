/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('checkComplaintRequestCtrl', ['$scope','$rootScope','$modalInstance','complaintRequest','jmService','utilSvc','constants',
    	 function($scope,$rootScope,$modalInstance,complaintRequest,apiSvc,utilSvc,constants){
    	 	$scope.submit=function(){
                $scope.complaintRequest.FMailDate = utilSvc.dateToString($scope.complaintRequest.FMailDate);;
                apiSvc.checkComplaintRequest({complaintRequest:$scope.complaintRequest,startDate:$rootScope.complaintRequest.startDate,endDate:$rootScope.complaintRequest.endDate})
                .$promise.then(function(complaintRequestList){
                    if (complaintRequestList){
                        $modalInstance.close(complaintRequestList);
                    } else {
                        utilSvc.addAlert("The Operation failed!", true);
                    }
                },
                function(err){
                    utilSvc.addAlert("The operation failed!", "fail", true);
                })
             }
    	 	$scope.reset=function(){
                $scope.complaintRequest={};
                angular.copy(complaintRequest,$scope.complaintRequest);
                //$scope.complaintRequest.fid = complaintRequest.fid;
             }
             $scope.reset();
    }])
 }());
