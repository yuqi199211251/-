/*jm - Controllers.js - Yadong Zhu 2018*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('FeedbackDetailCtrl', ['$scope',"$location",'FeedbackDetailList','jmService','utilSvc','$modal','constants',
    	 function($scope,$location,FeedbackDetailList,apiSvc,utilSvc,$modal,constants){
            $scope.files = [];
            $scope.FeedbackDetailList = FeedbackDetailList;


            $scope.reset=function(){
            }
            $scope.reset();

            if (FeedbackDetailList){
                $scope.FeedbackDetailList = FeedbackDetailList;
                $scope.totalItems = FeedbackDetailList.length;
                $scope.itemPerPage = constants.pageMessage.itemPerPage;
                $scope.currentPage = constants.pageMessage.currentPage;
                $scope.maxSize = constants.pageMessage.maxSize;
                $scope.pageChanged=function(){
                    $scope.FeedbackDetailListByPage=[];
                    var startData = $scope.itemPerPage * ($scope.currentPage-1);
                    var endData = $scope.itemPerPage * $scope.currentPage-1;
                    if(endData>$scope.totalItems){
                        endData = $scope.totalItems-1
                    }
                    var num = 0;                
                    if($scope.FeedbackDetailListByPage){
                        for(var i = startData;i<=endData;i++){
                            if($scope.FeedbackDetailList[i]!=undefined){
                                $scope.FeedbackDetailListByPage[num]=$scope.FeedbackDetailList[i];
                            }
                            num++;
                        }
                    }
                };
                $scope.pageChanged();
            }
        
    }])
 }());
