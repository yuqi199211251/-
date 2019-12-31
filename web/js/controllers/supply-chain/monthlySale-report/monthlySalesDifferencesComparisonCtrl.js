/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('monthlySalesDifferencesComparisonCtrl',['$scope','$rootScope','$location','$modal','utilSvc','jmService','constants',
	function($scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants){

        $scope.year = 0;
        $scope.month = 0;
        $scope.temp = {};
        $scope.itemPerPage = constants.pageMessage.itemPerPage;
        $scope.currentPage = constants.pageMessage.currentPage;
        $scope.maxSize = constants.pageMessage.maxSize;
        var categories = ["productType"];
        apiSvc.getListByCategories({categories:categories})
        .$promise.then(function(data){
            if (data){
                $scope.productTypeList=data[0];
            } else {
                utilSvc.addAlert("The Operation failed!", "fail", true);
            }
        },
        function(err){
            utilSvc.addAlert("The operation failed!", "fail", true);
        })

        $scope.pageChanged=function(){
            if ($scope.monthlySalesDifferencesComparisonList!=undefined){
                $scope.monthlySalesDifferencesComparisonListByPage=[];
                var startData = $scope.itemPerPage * ($scope.currentPage-1);
                var endData = $scope.itemPerPage * $scope.currentPage-1;
                if(endData>$scope.totalItems){
                    endData = $scope.totalItems-1
                }
                var num = 0;                
                if($scope.monthlySalesDifferencesComparisonListByPage){
                    for(var i = startData;i<=endData;i++){
                        if($scope.monthlySalesDifferencesComparisonList[i]!=undefined){
                            $scope.monthlySalesDifferencesComparisonListByPage[num]=$scope.monthlySalesDifferencesComparisonList[i];
                        }
                        num++;
                    }
                }
            }
        };
        $scope.pageChanged();

        $scope.queryMonthlySalesDifferencesComparisonList=function(){
            if($scope.temp.queryDate != undefined && $scope.temp.queryDate != "undefined" && $scope.temp.queryDate != "" && $scope.msdcSearch.ProductTypeName != "选择产品类别"){
                $scope.year = $scope.temp.queryDate.getFullYear(); 
                $scope.month =$scope.temp.queryDate.getMonth() + 1; 
                apiSvc.getMonthlySalesDifferencesComparisonList({productTypeName:$scope.msdcSearch.ProductTypeName,queryYear:$scope.year,queryMonth:$scope.month}).$promise.then(
                    function(data){
                        $scope.monthlySalesDifferencesComparisonList = data;
                        $scope.adjustmentData();
                    },
                    function(err){
                        if (err.data&&err.data.message)
                            utilSvc.addAlert(err.data.message, "fail", true);
                        else
                            utilSvc.addAlert(JSON.stringify(err), "fail", true);
                    })
            }
        };


        
        $scope.adjustmentData=function(){
            $scope.monthlySalesDifferencesComparisonListByPage=[];
            var startData = $scope.itemPerPage * ($scope.currentPage-1);
            var endData = $scope.itemPerPage * $scope.currentPage-1;
            $scope.totalItems = $scope.monthlySalesDifferencesComparisonList.length;
            if(endData>$scope.monthlySalesDifferencesComparisonList.length){
                endData = $scope.monthlySalesDifferencesComparisonList.length-1
            }
            var num = 0;
            if($scope.monthlySalesDifferencesComparisonList){
                for(var i = startData;i<=endData;i++){
                    if($scope.monthlySalesDifferencesComparisonList[i]!=undefined){
                        $scope.monthlySalesDifferencesComparisonListByPage[num]=$scope.monthlySalesDifferencesComparisonList[i];
                    }
                    num++;
                }
            }
        }


    }])
 }());
