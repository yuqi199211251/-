/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('selectFeedbackNumberCtrl', ['$scope','$rootScope', '$modalInstance','utilSvc','jmService','constants','selectFeedbackNumberList',
    	 function($scope,$rootScope,$modalInstance,utilSvc,apiSvc,constants,selectFeedbackNumberList){
    	 	$scope.submit=function(){
                /* apiSvc.addEditUser({user:$scope.user})
                .$promise.then(function(userList){
                    if (userList){
                        $modalInstance.close(userList);
                    } else {
                        utilSvc.addAlert("The Operation failed!", "fail", true);
                    }
                },
                function(err){
                    utilSvc.addAlert("The operation failed!", "fail", true);
                }) */
            }

            if (selectFeedbackNumberList){
                $scope.selectFeedbackNumberList = selectFeedbackNumberList;
                $scope.totalItems = selectFeedbackNumberList.length;
                $scope.itemPerPage = constants.pageMessage.itemPerPage;
                $scope.currentPage = constants.pageMessage.currentPage;
                $scope.maxSize = constants.pageMessage.maxSize;
                $scope.pageChanged=function(){
                    $scope.selectFeedbackNumberListByPage=[];
                    var startData = $scope.itemPerPage * ($scope.currentPage-1);
                    var endData = $scope.itemPerPage * $scope.currentPage-1;
                    if(endData>$scope.totalItems){
                        endData = $scope.totalItems-1
                    }
                    var num = 0;                
                    if($scope.selectFeedbackNumberListByPage){
                        for(var i = startData;i<=endData;i++){
                            if($scope.selectFeedbackNumberList[i]!=undefined){
                                $scope.selectFeedbackNumberListByPage[num]=$scope.selectFeedbackNumberList[i];
                            }
                            num++;
                        }
                    }
                };
                $scope.pageChanged();
            }


            $scope.selectFeedbackNumberFinal=function(selectFeedbackNumber){
                $modalInstance.close(selectFeedbackNumber);
             }
    }])
 }());
