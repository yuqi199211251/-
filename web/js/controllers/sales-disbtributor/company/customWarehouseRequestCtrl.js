/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('customWarehouseRequestCtrl',['$scope','$rootScope','$location','$modal','utilSvc','jmService','constants',
	function($scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants){
        apiSvc.getCustomWareHouseInformationList().$promise.then(function(data){
             var customWareHouserInformationList = data;
             $scope.customWareHouserInformationList = customWareHouserInformationList;
             $scope.totalItems = customWareHouserInformationList.length;
             $scope.itemPerPage = constants.pageMessage.itemPerPage;
             $scope.currentPage = constants.pageMessage.currentPage;
             $scope.maxSize = constants.pageMessage.maxSize;
             $scope.pageChanged=function(){
                 $scope.customWareHouserInformationListByPage=[];
                 var startData = $scope.itemPerPage * ($scope.currentPage-1);
                 var endData = $scope.itemPerPage * $scope.currentPage-1;
                 if(endData>$scope.totalItems){
                     endData = $scope.totalItems-1
                 }
                 var num = 0;                
                 if($scope.customWareHouserInformationListByPage){
                     for(var i = startData;i<=endData;i++){
                         if($scope.customWareHouserInformationList[i]!=undefined){
                             $scope.customWareHouserInformationListByPage[num]=$scope.customWareHouserInformationList[i];
                         }
                         num++;
                     }
                 }
             };
             $scope.pageChanged();
        },function(err){
            utilSvc.pageLoading("stop");
        })

        //点击添加修改按钮
         $scope.addEditCustomWareHouseInformationRequest = function(data){
            var modalInstance = $modal.open({
                templateUrl: 'partials/sales-disbtributor/company/addEditCustomWareHouserInfo.html',
                controller: 'addEditCustomWareHouseInfoCtrl',
                resolve: {
                    //预加载
                    //添加的时候data为空
                    cust:function(){return data}
                }
            });
            modalInstance.result.then(function (data) {//模态窗口关闭之后回传参数
                $scope.customWareHouserInformationList = data;
                $scope.flushPage();
            }, function (reason) { 
                console.log(reason); 
            }); 
         }

         //点击删除
         $scope.deleteCustomInformationRequest = function(cust){
            apiSvc.deleteCustomInformationRequest({cust:cust}).$promise.then(
                function(data){
                    utilSvc.addAlert("删除成功!", "success", true);
                    $scope.customWareHouserInformationList = data;
                    $scope.flushPage();
                },
                function(err){
                    if (err.data&&err.data.message)
                        utilSvc.addAlert(err.data.message, "fail", false);
                    else
                        utilSvc.addAlert(JSON.stringify(err), "fail", false);
                }) 
        } 


        $scope.flushPage=function(){
            $scope.customWareHouserInformationListByPage=[];
            var startData = $scope.itemPerPage * ($scope.currentPage-1);
            var endData = $scope.itemPerPage * $scope.currentPage-1;
            $scope.totalItems = $scope.customWareHouserInformationList.length;
            if(endData>$scope.customWareHouserInformationList.length){
                endData = $scope.customWareHouserInformationList.length-1
            }
            var num = 0;
            if($scope.customWareHouserInformationList){
                for(var i = startData;i<=endData;i++){
                    if($scope.customWareHouserInformationList[i]!=undefined){
                        $scope.customWareHouserInformationListByPage[num]=$scope.customWareHouserInformationList[i];
                    }
                    num++;
                }
            }
        }
        
    }])
 }());
