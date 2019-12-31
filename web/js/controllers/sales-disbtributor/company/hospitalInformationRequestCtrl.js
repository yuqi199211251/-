/*jm - Controllers.js - zhiqiangsong 2019*/
(function() {
    'use strict';
    /* Controllers */
    angular.module('jm.controllers')
    .controller('hospitalInformationRequestCtrl',['$scope','$rootScope','$location','$modal','utilSvc','jmService','constants',
	function($scope,$rootScope,$location,$modal,utilSvc,apiSvc,constants){
        apiSvc.getHospitalInformationList().$promise.then(function(data){
             $rootScope.SubMessage = data[1];//医院级别，定义成全局变量
             var hospitalInformationList = data[0];
             $scope.hospitalInformationList = hospitalInformationList;
             $scope.totalItems = Object.entries(hospitalInformationList).length;
             $scope.itemPerPage = constants.pageMessage.itemPerPage;
             $scope.currentPage = constants.pageMessage.currentPage;
             $scope.maxSize = constants.pageMessage.maxSize;
             $scope.pageChanged=function(){
                 $scope.hospitalInformationListByPage=[];
                 var startData = $scope.itemPerPage * ($scope.currentPage-1);
                 var endData = $scope.itemPerPage * $scope.currentPage-1;
                 if(endData>$scope.totalItems){
                     endData = $scope.totalItems-1
                 }
                 var num = 0;                
                 if($scope.hospitalInformationListByPage){
                     for(var i = startData;i<=endData;i++){
                         if($scope.hospitalInformationList[i]!=undefined){
                             $scope.hospitalInformationListByPage[num]=$scope.hospitalInformationList[i];
                         }
                         num++;
                     }
                 }
             };
             $scope.pageChanged();
        },function(err){
            utilSvc.pageLoading("stop");
        })

        //点击修改按钮
         $scope.addEditHospitalInformationRequest = function(data){
            var SubMessageLength = Object.entries($rootScope.SubMessage).length;
            var SubMessage = $rootScope.SubMessage;
            var modalInstance = $modal.open({
                templateUrl: 'partials/sales-disbtributor/company/addEditHospitalInfo.html',
                controller: 'addEditHospitalInfoCtrl',
                resolve: {
                    //预加载
                    cust:function(){return data},
                    SubMessageLength:function(){return SubMessageLength},
                    SubMessage:function(){return SubMessage}
                }
            });
            modalInstance.result.then(function (data) {//模态窗口关闭之后回传参数
                $scope.hospitalInformationList = data;
                $scope.flushPage();
            }, function (reason) { 
                console.log(reason); 
            }); 
         }

         


        $scope.flushPage=function(){
            $scope.hospitalInformationListByPage=[];
            var startData = $scope.itemPerPage * ($scope.currentPage-1);
            var endData = $scope.itemPerPage * $scope.currentPage-1;
            $scope.totalItems = $scope.hospitalInformationList.length;
            if(endData>$scope.hospitalInformationList.length){
                endData = $scope.hospitalInformationList.length-1
            }
            var num = 0;
            if($scope.hospitalInformationList){
                for(var i = startData;i<=endData;i++){
                    if($scope.hospitalInformationList[i]!=undefined){
                        $scope.hospitalInformationListByPage[num]=$scope.hospitalInformationList[i];
                    }
                    num++;
                }
            }
        }
        
    }])
 }());
