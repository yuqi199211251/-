/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('companyInformationRequestCtrl',['$scope','$rootScope','$location','$modal','companyInformationList','utilSvc','jmService','constants',
	function($scope,$rootScope,$location,$modal,companyInformationList,utilSvc,apiSvc,constants){
        if (companyInformationList){
             $scope.companyInformationList = companyInformationList;
             $scope.totalItems = companyInformationList.length;
             $scope.itemPerPage = constants.pageMessage.itemPerPage;
             $scope.currentPage = constants.pageMessage.currentPage;
             $scope.maxSize = constants.pageMessage.maxSize;
             $scope.pageChanged=function(){
                 $scope.companyInformationListByPage=[];
                 var startData = $scope.itemPerPage * ($scope.currentPage-1);
                 var endData = $scope.itemPerPage * $scope.currentPage-1;
                 if(endData>$scope.totalItems){
                     endData = $scope.totalItems-1
                 }
                 var num = 0;                
                 if($scope.companyInformationListByPage){
                     for(var i = startData;i<=endData;i++){
                         if($scope.companyInformationList[i]!=undefined){
                             $scope.companyInformationListByPage[num]=$scope.companyInformationList[i];
                         }
                         num++;
                     }
                 }
             };
             $scope.pageChanged();
         }

         $scope.addEditcompanyInformationRequest = function(data){
            var modalInstance = $modal.open({
                templateUrl: 'partials/sales-disbtributor/company/addEditCompanyInfo.html',
                controller: 'addEditCompanyInfoCtrl',
                resolve: {
                    //预加载
                    cust:function(){return data}
                }
            });
            modalInstance.result.then(function (data) {//模态窗口关闭之后回传参数
                $scope.companyInformationList = data;
                $scope.flushPage();
            }, function (reason) { 
                console.log(reason); 
            }); 
         }

         

        $scope.deletecompanyInformationRequest = function(FID){
            apiSvc.deleteCompanyInfo({FID:FID}).$promise.then(
                function(data){
                    $scope.companyInformationList = data;
                    $scope.flushPage();
                },
                function(err){
                    if (err.data&&err.data.message)
                        utilSvc.addAlert(err.data.message, "fail", true);
                    else
                        utilSvc.addAlert(JSON.stringify(err), "fail", true);
                }) 
        }

        $scope.flushPage=function(){
            $scope.companyInformationListByPage=[];
            var startData = $scope.itemPerPage * ($scope.currentPage-1);
            var endData = $scope.itemPerPage * $scope.currentPage-1;
            $scope.totalItems = $scope.companyInformationList.length;
            if(endData>$scope.companyInformationList.length){
                endData = $scope.companyInformationList.length-1
            }
            var num = 0;
            if($scope.companyInformationList){
                for(var i = startData;i<=endData;i++){
                    if($scope.companyInformationList[i]!=undefined){
                        $scope.companyInformationListByPage[num]=$scope.companyInformationList[i];
                    }
                    num++;
                }
            }
        }
        
    }])
 }());
